use std::fs::rename;
use rocket::{get, patch, put, routes};
use rocket::Route;
use std::io::ErrorKind;
use rocket::fs::NamedFile;
use rocket::http::Status;
use rocket::response::status::NotFound;
use rocket::serde::json::Json;
use rocket_download_response::DownloadResponse;
use uuid::Uuid;
use crate::db;
use crate::db::models::add_model_to_db;
use crate::db::types::{FileRecord, FileUpdate};
use crate::util::{ensure_tree, get_library_dir, make_id};

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

#[patch("/files/<file_id>", data = "<data>")]
fn update_file(file_id: &str, data: Json<FileUpdate>) -> Json<FileRecord> {
    let updated_file = db::model_files::update_file(&file_id, &data).expect("Failed to update file");

    Json(updated_file)
}

#[put("/files/<file_id>/models/<model_id>")]
fn move_file_to_model(file_id: &str, model_id: &str) -> Json<FileRecord> {
    let file = db::model_files::get_file(&file_id).expect("Failed to get file");

    let new_model_id;
    let original_model_id = file.model_id.clone();

    if model_id.eq("new") {
        new_model_id = make_id();
        add_model_to_db(&file.name, &new_model_id);
    } else {
        new_model_id = Uuid::parse_str(&model_id).expect("Failed to parse model id");
    }

    let updated_file = db::model_files::move_file_to_new_model(&file_id, &new_model_id).expect("Failed to move file to new model");

    let original_folder_1 = original_model_id[0..2].to_string();
    let original_folder_2 = original_model_id[2..4].to_string();

    let new_folder_1 = new_model_id.hyphenated().to_string().as_str()[0..2].to_string();
    let new_folder_2 = new_model_id.hyphenated().to_string().as_str()[2..4].to_string();

    let library_dir = get_library_dir().expect("Failed to get library dir");

    let mut original_path = library_dir.clone();
    original_path.push(original_folder_1);
    original_path.push(original_folder_2);
    original_path.push(original_model_id);

    let mut new_path = library_dir.clone();
    new_path.push(new_folder_1);
    new_path.push(new_folder_2);
    new_path.push(new_model_id.hyphenated().to_string().as_str());

    match file.category.as_str() {
        "part" => {},
        "image" => {
            original_path.push("images");
            new_path.push("images");
        },
        "project" => {
            original_path.push("projects");
            new_path.push("projects");
        },
        "support" => {
            original_path.push("support");
            new_path.push("support");
        },
        _ => {},
    };

    original_path.push(&file.file_name);

    let id_str = new_model_id.hyphenated().to_string();
    let path_str = new_path.to_str().unwrap();

    ensure_tree(&new_path).expect(format!("Failed to create destination directory '{}' for new directory '{}'", path_str, id_str).as_str());

    new_path.push(&file.file_name);

    rename(&original_path, &new_path).expect(format!("Failed to move file '{}' to '{}'", &file.file_name, new_path.to_str().unwrap()).as_str());

    Json(updated_file)
}

pub fn routes() -> Vec<Route> {
    routes![
        get_static_file,
        download_file,
        update_file,
        move_file_to_model,
    ]
}
