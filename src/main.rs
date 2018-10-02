#![feature(plugin)]
#![plugin(rocket_codegen)]

extern crate rocket;

use std::sync::RwLock;
use rocket::{Rocket,State};

struct Greeting {
    text: RwLock<String>,
}

#[get("/")]
fn index() -> String {
    String::from("Hello, world!")
}

#[get("/dynamic")]
fn dynamic(greeting: State<Greeting>) -> String {
    greeting.text.read().unwrap().clone()
}

#[post("/greeting", data = "<input>")]
fn set_greeting(input: String, greeting: State<Greeting>) -> String {
    let mut text = greeting.text.write().unwrap();
    *text = input.clone();
    String::from("success!")
}

fn rocket() -> Rocket {
    let greeting = Greeting{
        text: RwLock::new(String::from("Hello, dynamic world!"))
    };
    rocket::ignite()
        .manage(greeting)
        .mount("/", routes![index,dynamic,set_greeting])
}

fn main() {
    rocket().launch();
}
