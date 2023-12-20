use std::path::PathBuf;
use rocket::{get, delete, patch, post, put, routes};
use rocket::Route;
use rocket::serde::json::Json;
use rocket::form::{Form, FromForm};
use rocket::fs::TempFile;
use uuid::{Uuid};
use crate::db;
use crate::db::model_files::{add_file_to_model, get_file_category};
use crate::db::types::{Label, ModelMetadata, ModelRecord, ModelUpdate, ModelWithMetadata};
use crate::rest::labels::NewLabel;
use crate::util::{ensure_tree, get_file_path, get_model_dir, get_safe_file_name};

#[get("/models?<deleted>")]
fn get_models(deleted: Option<bool>) -> Json<Vec<ModelWithMetadata>> {
    let list_deleted = deleted.unwrap_or(false);
    println!("List deleted: {}", list_deleted);
    let models = db::models::list_models(list_deleted).expect("Failed to list models");

    Json(models)
}

#[get("/models/<model_id>")]
fn get_model(model_id: &str) -> Option<Json<ModelRecord>> {
    let model = db::models::get_model(&model_id, false);

    if model.is_none() {
        return None;
    }

    Some(Json(model.unwrap()))
}

#[delete("/models/<model_id>")]
fn delete_model(model_id: &str) -> () {
    db::models::delete_model(&model_id).expect("Failed to delete model");
}

#[patch("/models/<model_id>", data = "<data>")]
fn update_model(model_id: &str, data: Json<ModelUpdate>) -> Json<ModelRecord> {
    let updated_model = db::models::update_model(&model_id, &data).expect("Failed to update model");

    Json(updated_model)
}

#[patch("/models/<model_id>/metadata", data = "<data>")]
fn update_metadata(model_id: &str, data: Json<ModelMetadata>) -> Json<ModelRecord> {
    let updated_model = db::models::update_metadata(&model_id, &data).expect("Failed to update model metadata");

    Json(updated_model)
}

#[get("/models/<model_id>/open")]
fn open_model_location(model_id: &str) -> () {
    let model_dir = get_model_dir(&model_id).expect("Failed to get model dir");
    open::that(model_dir).expect("Failed to open model dir");
}

#[derive(FromForm)]
struct Upload<'r> {
    file: TempFile<'r>,
    file_name: &'r str,
}

#[post("/models/<model_id>/files", data = "<data>")]
async fn upload_file_to_model(model_id: &str, mut data: Form<Upload<'_>>) -> Option<Json<ModelRecord>> {
    let file_category = get_file_category(&data.file_name);

    let check_model = db::models::get_model(&model_id, false);

    if check_model.is_none() {
        log::error!("Model {model_id:?} does not exist");
        return None;
    }

    if file_category.is_some() {
        let file_category = get_file_category(&data.file_name).unwrap();
        let safe_file_name = get_safe_file_name(&PathBuf::from(&data.file_name));

        let final_path = get_file_path(&model_id, &file_category.to_string(), &safe_file_name).expect("Failed to get file path");
        let mut final_dir = final_path.clone();
        final_dir.pop();
        ensure_tree(&final_dir).expect("Failed to create destination directory for file");

        let model_id = Uuid::parse_str(&model_id).expect("Failed to parse model id");

        log::info!("Importing file {safe_file_name:?} to {final_path:?}");

        let file_size = data.file.len();
        let move_result = data.file.copy_to(&final_path).await;

        if move_result.is_ok() {
            add_file_to_model(&safe_file_name, file_size, &model_id, file_category);
        } else {
            log::error!("Error: {}", move_result.err().unwrap());
            log::error!("Failed to move file {safe_file_name:?} to {final_path:?}");
        }
    }

    let model = db::models::get_model(&model_id, false).expect("Failed to retrieve model");

    Some(Json(model))
}

#[put("/models/<model_id>/labels", data = "<data>")]
fn add_label_to_model(model_id: &str, data: Json<Label>) -> Json<ModelRecord> {
    let updated_model = db::models::add_label_to_model(&model_id, &data.id).expect("Failed to add label to model");

    Json(updated_model)
}

#[post("/models/<model_id>/labels", data = "<data>")]
fn add_new_label_to_model(model_id: &str, data: Json<NewLabel>) -> Json<ModelRecord> {
    let label = db::labels::create_label(&data.name).expect("Failed to create label");
    let updated_model = db::models::add_label_to_model(&model_id, &label.id).expect("Failed to add label to model");

    Json(updated_model)
}

pub fn routes() -> Vec<Route> {
    routes![
        get_models,
        get_model,
        update_model,
        update_metadata,
        add_label_to_model,
        add_new_label_to_model,
        open_model_location,
        upload_file_to_model,
        delete_model,
    ]
}
