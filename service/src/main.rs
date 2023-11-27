#[macro_use]
extern crate rocket;

use std::thread;

use athenaeum_import::{db, scanner};

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[launch]
fn rocket() -> _ {
    db::init();

    thread::spawn(|| {
        scanner::init();
    });

    rocket::build().mount("/", routes![index])
}
