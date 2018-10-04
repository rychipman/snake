#![feature(plugin)]
#![plugin(rocket_codegen)]

extern crate rocket;
#[macro_use] extern crate rocket_contrib;
#[macro_use] extern crate diesel;
#[macro_use] extern crate serde_derive;

mod schema;
mod db;
mod models;

use models::Score;

use rocket::{Rocket};
use rocket_contrib::{Json, Value};

use diesel::prelude::*;
use diesel::insert_into;

#[get("/")]
fn index() -> String {
    String::from("Hello, world!")
}

#[get("/dynamic")]
fn dynamic(conn: db::Conn) -> String {
    format!("all greetings: {:?}", models::Greeting::all(conn.handler()))
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

#[post("/scores/new", format = "application/json", data = "<score>")]
fn add_score(score: Json<Score>) -> Json<Value> {
    let score = score.0;
    Json(json!({
        "status": "failure",
        "error": "db insertion not yet implemented",
        "message": format!("got score with email {}", score.email)
    }))
}

fn rocket() -> Rocket {
    rocket::ignite()
        .manage(db::init_pool())
        .mount("/", routes![index,dynamic,set_greeting,add_score])
}

fn main() {
    rocket().launch();
}
