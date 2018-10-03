#![feature(plugin)]
#![plugin(rocket_codegen)]

extern crate rocket;
#[macro_use] extern crate diesel;

mod schema;
mod db;

use rocket::{Rocket};

use diesel::prelude::*;
use diesel::insert_into;

#[get("/")]
fn index() -> String {
    String::from("Hello, world!")
}

#[get("/dynamic")]
fn dynamic(conn: db::Conn) -> String {
    use schema::greetings::dsl::*;
    let res = greetings.select(text).load::<String>(conn.handler()).unwrap();
    format!("{:?}", res)
}

#[post("/greeting", data = "<input>")]
fn set_greeting(input: String, conn: db::Conn) -> String {
    use schema::greetings::dsl::*;
    let res = insert_into(greetings)
        .values(text.eq(input.clone()))
        .execute(conn.handler());
    match res {
        Ok(_) => String::from("success!"),
        Err(_) => String::from("failed"),
    }
}

fn rocket() -> Rocket {
    rocket::ignite()
        .manage(db::init_pool())
        .mount("/", routes![index,dynamic,set_greeting])
}

fn main() {
    rocket().launch();
}
