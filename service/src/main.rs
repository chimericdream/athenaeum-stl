#[macro_use]
extern crate rocket;

use std::thread;
use rocket::serde::{json::Json};

use athenaeum_server::{db, logger, scanner};
use athenaeum_server::db::types::{Model};

#[get("/")]
fn index() -> Json<Vec<Model>> {
    let models = db::models::list_models().expect("Failed to list models");

    Json(models)
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
