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
        .mount("/", routes![add_score,get_scores])
}

fn main() {
    rocket().launch();
}
