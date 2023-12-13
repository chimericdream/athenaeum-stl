use rocket::{get, patch, routes};
use rocket::Route;
use std::io::ErrorKind;
use rocket::fs::NamedFile;
use rocket::http::Status;
use rocket::response::status::NotFound;
use rocket::serde::json::Json;
use rocket_download_response::DownloadResponse;
use crate::db;
use crate::db::types::{FileRecord, FileUpdate};
use crate::util::get_library_dir;

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

pub fn routes() -> Vec<Route> {
    routes![
        get_static_file,
        download_file,
        update_file,
    ]
}
