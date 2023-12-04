#[macro_use]
extern crate rocket;

use std::thread;
use rocket::fs::NamedFile;
use rocket::response::status::NotFound;
use rocket::serde::{json::Json};

use athenaeum_server::{db, logger, scanner};
use athenaeum_server::db::types::{Model, ModelRecord};
use athenaeum_server::util::get_library_dir;

#[get("/static/<model_id>/<file_type>/<file_name>")]
async fn get_static_file(model_id: &str, file_type: &str, file_name: &str) -> Result<NamedFile, NotFound<String>> {
    let folder_1 = model_id[0..2].to_string();
    let folder_2 = model_id[2..4].to_string();

    let library_dir = get_library_dir().expect("Failed to get library dir");

    let mut final_path = library_dir.clone();
    final_path.push(folder_1);
    final_path.push(folder_2);
    final_path.push(model_id);

    match file_type {
        "part" => {},
        "image" => {
            final_path.push("images");
        },
        "project" => {
            final_path.push("projects");
        },
        "support" => {
            final_path.push("support");
        },
        _ => {},
    };

    final_path.push(file_name);

    NamedFile::open(&final_path).await.map_err(|e| NotFound(e.to_string()))
}

#[get("/models/<model_id>")]
fn get_model(model_id: &str) -> Json<ModelRecord> {
    let model = db::models::get_model(&model_id).expect("Failed to retrieve model");

    Json(model)
}

#[get("/models")]
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

    rocket::build().mount("/", routes![index, get_model, get_static_file])
}
