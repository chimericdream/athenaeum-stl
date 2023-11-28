#[macro_use]
extern crate rocket;

use std::thread;

use athenaeum_import::{db, logger, scanner};

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[launch]
fn rocket() -> _ {
    logger::init().expect("Failed to initialize logger");

    db::init();

    thread::spawn(|| {
        scanner::init();
    });

    rocket::build().mount("/", routes![index])
}
