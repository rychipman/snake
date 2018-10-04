#![feature(plugin)]
#![plugin(rocket_codegen)]
#![allow(proc_macro_derive_resolution_fallback)]

extern crate rocket;
extern crate rocket_contrib;
#[macro_use] extern crate diesel;
#[macro_use] extern crate serde_derive;

mod schema;
mod db;
mod models;

use models::Score;

use rocket::Rocket;
use rocket_contrib::{Json,Template};

#[derive(Serialize)]
struct TemplateCtx {
    title: String,
    scores: Vec<Score>,
}

#[get("/")]
fn index(conn: db::Conn) -> Template {
    let ctx = TemplateCtx{
        title: String::from("My Title"),
        scores: Score::all(conn.handler()),
    };
    Template::render("index", &ctx)
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
        .mount("/", routes![index,add_score,get_scores])
        .attach(Template::fairing())
}

fn main() {
    rocket().launch();
}
