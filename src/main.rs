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
    let msg = models::Greeting{ id: None, text: input };
    let ok = models::Greeting::insert(msg, conn.handler());
    match ok {
        true => String::from("success!"),
        false => String::from("failed"),
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
