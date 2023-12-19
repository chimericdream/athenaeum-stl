#[macro_use]
extern crate rocket;

use rocket::config::{Config};
use rocket::data::{Limits, ToByteUnit};
use athenaeum_server::{db, logger, rest, scanner};

#[launch]
fn rocket() -> _ {
    logger::init().expect("Failed to initialize logger");

    db::init();
    scanner::init();

    // You can also deserialize this
    let cors = rocket_cors::CorsOptions {
        ..Default::default()
    }
    .to_cors().unwrap();

    let limits = Limits::default()
        .limit("file", 1000.mebibytes())
        .limit("form", 1000.mebibytes())
        .limit("data-form", 1000.mebibytes())
        .limit("json", 1000.mebibytes())
        .limit("string", 1000.mebibytes());

    let mut config = Config::default();
    config.limits = limits;

    rocket::build()
        .configure(config)
        .mount("/", rest::routes())
        .attach(cors)
}
