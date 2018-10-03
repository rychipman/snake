#![feature(plugin)]
#![plugin(rocket_codegen)]

extern crate rocket;
#[macro_use] extern crate diesel;

table! {
    greetings (id) {
        id -> Nullable<Integer>,
        text -> Text,
    }
}

use std::ops::Deref;

use rocket::{Rocket,State,Request,Outcome};
use rocket::http::Status;
use rocket::request::{self,FromRequest};

use diesel::prelude::*;
use diesel::insert_into;
use diesel::sqlite::SqliteConnection;
use diesel::r2d2::{ConnectionManager, Pool, PooledConnection};

type SqlitePool = Pool<ConnectionManager<SqliteConnection>>;
static DATABASE_URL: &'static str = "/Users/ryan/git/personal/snake-web/tmp/db.sqlite";

fn init_pool() -> SqlitePool {
    let manager = ConnectionManager::<SqliteConnection>::new(DATABASE_URL);
    Pool::new(manager).expect("db pool")
}

pub struct DbConn(pub PooledConnection<ConnectionManager<SqliteConnection>>);

impl<'a, 'r> FromRequest<'a, 'r> for DbConn {
    type Error = ();

    fn from_request(request: &'a Request<'r>) -> request::Outcome<Self, Self::Error> {
        let pool = request.guard::<State<SqlitePool>>()?;
        match pool.get() {
            Ok(conn) => Outcome::Success(DbConn(conn)),
            Err(_) => Outcome::Failure((Status::ServiceUnavailable, ()))
        }
    }
}

impl Deref for DbConn {
    type Target = SqliteConnection;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

#[get("/")]
fn index() -> String {
    String::from("Hello, world!")
}

#[get("/dynamic")]
fn dynamic(conn: DbConn) -> String {
    use greetings::dsl::*;
    let res = greetings.select(text).load::<String>(&*conn).unwrap();
    format!("{:?}", res)
}

#[post("/greeting", data = "<input>")]
fn set_greeting(input: String, conn: DbConn) -> String {
    use greetings::dsl::*;
    let res = insert_into(greetings)
        .values(text.eq(input.clone()))
        .execute(&*conn);
    match res {
        Ok(_) => String::from("success!"),
        Err(_) => String::from("failed"),
    }
}

fn rocket() -> Rocket {
    rocket::ignite()
        .manage(init_pool())
        .mount("/", routes![index,dynamic,set_greeting])
}

fn main() {
    rocket().launch();
}
