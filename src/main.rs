#![feature(plugin)]
#![feature(custom_attribute)]
#![plugin(rocket_codegen)]
#![allow(proc_macro_derive_resolution_fallback)]

extern crate rocket;
extern crate rocket_contrib;
#[macro_use] extern crate diesel;
#[macro_use] extern crate serde_derive;

mod schema;
mod db;
mod models;

use models::{Score,ScoreInsert,ScoreQuery};

use rocket::Rocket;
use rocket::response::NamedFile;
use rocket_contrib::{Json,Template};

use std::path::{Path,PathBuf};

#[derive(Serialize)]
struct TemplateCtx {
    scores: Vec<ScoreQuery>,
}

#[get("/")]
fn index(conn: db::Conn) -> Template {
    let ctx = TemplateCtx{
        scores: Score::top(10, conn.handler()).unwrap(),
    };
    Template::render("index", &ctx)
}

#[get("/game/<path..>", rank = 1)]
fn game_files(path: PathBuf) -> Option<NamedFile> {
    let path = Path::new("/Users/ryan/git/personal/snake/game/").join(path);
    NamedFile::open(path).ok()
}

#[get("/<path..>", rank = 2)]
fn files(path: PathBuf) -> Option<NamedFile> {
    NamedFile::open(Path::new("/Users/ryan/git/personal/snake/static/").join(path)).ok()
}

#[post("/scores/new", format = "application/json", data = "<score>")]
fn add_score(score: Json<ScoreInsert>, conn: db::Conn) -> String {
    let res = Score::insert(score.0, conn.handler());
    match res {
        Ok(count) => format!("success! {} rows inserted", count),
        Err(err) => format!("failed: {}", err),
    }
}

#[get("/scores")]
fn get_scores(conn: db::Conn) -> String {
    format!("all scores: {:?}", Score::all(conn.handler()).unwrap())
}

fn rocket() -> Rocket {
    rocket::ignite()
        .manage(db::init_pool())
        .mount("/", routes![index])
        .mount("/static", routes![files,game_files])
        .mount("/api", routes![add_score,get_scores])
        .attach(Template::fairing())
}

fn main() {
    rocket().launch();
}
