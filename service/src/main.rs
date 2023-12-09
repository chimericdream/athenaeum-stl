#[macro_use]
extern crate rocket;

use std::io::ErrorKind;
use rocket::fs::NamedFile;
use rocket::http::{Status};
use rocket::response::status::NotFound;
use rocket::serde::{Deserialize, json::Json};
use rocket_download_response::DownloadResponse;

use athenaeum_server::{db, logger, scanner};
use athenaeum_server::db::types::{Label, Model, ModelRecord, ModelUpdate};
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

#[get("/download/<model_id>/<file_type>/<file_name>")]
async fn download_file(model_id: &str, file_type: &str, file_name: &str) -> Result<DownloadResponse, Status> {
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

    DownloadResponse::from_file(final_path, None::<String>, None).await.map_err(|err| {
        if err.kind() == ErrorKind::NotFound {
            Status::NotFound
        } else {
            Status::InternalServerError
        }
    })
}

#[derive(Deserialize)]
#[serde(crate = "rocket::serde")]
struct NewLabel {
    name: String,
}

#[post("/labels", data = "<data>")]
fn create_label(data: Json<NewLabel>) -> Json<Label> {
    let label = db::labels::create_label(&data.name).expect("Failed to create label");

    Json(label)
}

/*
PUT /labels/<label_id> -> update_label
    {"name": "..."}
GET /models/<model_id>/labels -> List of labels
PUT /models/<model_id>/labels -> Add a label
    {"id": "..."} -> add an existing label
    {"name": "..."} -> create a new label and add it
DELETE /models/<model_id>/labels/<label_id> -> Remove a label
 */

#[post("/models/<model_id>/labels", data = "<data>")]
fn add_new_label_to_model(model_id: &str, data: Json<NewLabel>) -> Json<ModelRecord> {
    let label = db::labels::create_label(&data.name).expect("Failed to create label");
    let updated_model = db::models::add_label_to_model(&model_id, &label.id).expect("Failed to add label to model");

    Json(updated_model)
}

#[put("/models/<model_id>/labels", data = "<data>")]
fn add_label_to_model(model_id: &str, data: Json<Label>) -> Json<ModelRecord> {
    let updated_model = db::models::add_label_to_model(&model_id, &data.id).expect("Failed to add label to model");

    Json(updated_model)
}

#[patch("/models/<model_id>", data = "<data>")]
fn update_model(model_id: &str, data: Json<ModelUpdate>) -> Json<ModelRecord> {
    let updated_model = db::models::update_model(&model_id, &data).expect("Failed to update model");

    Json(updated_model)
}

#[get("/models/<model_id>")]
fn get_model(model_id: &str) -> Json<ModelRecord> {
    let model = db::models::get_model(&model_id).expect("Failed to retrieve model");

    Json(model)
}

#[get("/models")]
fn get_models() -> Json<Vec<Model>> {
    let models = db::models::list_models().expect("Failed to list models");

    Json(models)
}

#[get("/labels")]
fn get_labels() -> Json<Vec<Label>> {
    let labels = db::labels::list_labels().expect("Failed to list labels");

    Json(labels)
}

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
        .mount(
            "/",
            routes![
                get_labels,
                create_label,
                get_models,
                get_model,
                update_model,
                add_label_to_model,
                add_new_label_to_model,
                download_file,
                get_static_file
            ]
        )
        .attach(cors)
}
