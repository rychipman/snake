#![feature(plugin)]
#![plugin(rocket_codegen)]

extern crate rocket;
use rocket::{Rocket,State};

struct Greeting {
    text: String,
}

#[get("/")]
fn index() -> String {
    String::from("Hello, world!")
}

#[get("/dynamic")]
fn dynamic(greeting: State<Greeting>) -> String {
    greeting.text.clone()
}

fn rocket() -> Rocket {
    rocket::ignite()
        .manage(Greeting { text: String::from("Hello, dynamic world!") })
        .mount("/", routes![index,dynamic])
}

fn main() {
    rocket().launch();
}
