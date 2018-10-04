#![feature(plugin)]
#![plugin(rocket_codegen)]

extern crate rocket;
extern crate rocket_contrib;
#[macro_use] extern crate diesel;
#[macro_use] extern crate serde_derive;

mod schema;
mod db;
mod models;

use models::Score;

use rocket::Rocket;
use rocket_contrib::Json;

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
fn add_score(score: Json<Score>, conn: db::Conn) -> String {
    let ok = score.0.insert(conn.handler());
    match ok {
        true => String::from("success!"),
        false => String::from("failed"),
    }
}

#[get("/scores")]
fn get_scores(conn: db::Conn) -> String {
    format!("all scores: {:?}", models::Score::all(conn.handler()))
}

fn rocket() -> Rocket {
    rocket::ignite()
        .manage(db::init_pool())
        .mount("/", routes![index,dynamic,set_greeting,add_score,get_scores])
}

fn main() {
    rocket().launch();
}
