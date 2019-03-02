#![feature(plugin)]
#![allow(proc_macro_derive_resolution_fallback)]
#![feature(proc_macro_hygiene, decl_macro)]

extern crate rocket;
#[macro_use]
extern crate rocket_contrib;
#[macro_use]
extern crate diesel;
#[macro_use]
extern crate serde_derive;

mod db;
mod models;
mod schema;

use models::{Score, ScoreInsert, ScoreQuery};

use rocket::response::NamedFile;
use rocket::{get, post, routes, Rocket};
use rocket_contrib::{
    json::{Json, JsonValue},
    templates::Template,
};

use std::path::{Path, PathBuf};

#[derive(Serialize)]
struct TemplateCtx {
    scores: Vec<ScoreQuery>,
}

#[get("/")]
fn index(conn: db::Conn) -> Template {
    let ctx = TemplateCtx {
        scores: Score::top(10, conn.handler()).unwrap(),
    };
    Template::render("index", &ctx)
}

#[get("/game/<path..>", rank = 1)]
fn game_files(path: PathBuf) -> Option<NamedFile> {
    let path = Path::new("game/").join(path);
    NamedFile::open(path).ok()
}

#[get("/<path..>", rank = 2)]
fn files(path: PathBuf) -> Option<NamedFile> {
    NamedFile::open(Path::new("static/").join(path)).ok()
}

#[post("/scores/new", format = "application/json", data = "<score>")]
fn add_score(score: Json<ScoreInsert>, conn: db::Conn) -> JsonValue {
    let res = Score::insert(score.0, conn.handler());
    let high_scores = Score::top(10, conn.handler()).unwrap();
    match res {
        Ok(_count) => json!({
            "status": "success",
            "id": 2,
            "highScores": high_scores
        }),
        Err(err) => json!({
            "status": "failed",
            "reason": err.to_string()
        }),
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
        .mount("/static", routes![files, game_files])
        .mount("/api", routes![add_score, get_scores])
        .attach(Template::fairing())
}

fn main() {
    rocket().launch();
}
