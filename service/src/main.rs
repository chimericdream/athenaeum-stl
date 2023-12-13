#[macro_use]
extern crate rocket;

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

    rocket::build()
        .mount("/", rest::routes())
        .attach(cors)
}
