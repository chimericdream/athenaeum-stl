use rocket::{get, patch, post, put, routes};
use rocket::Route;
use rocket::serde::json::Json;
use crate::db;
use crate::db::types::{Label, Model, ModelMetadata, ModelRecord, ModelUpdate};
use crate::rest::labels::NewLabel;
use crate::util::get_model_dir;

#[get("/models")]
fn get_models() -> Json<Vec<Model>> {
    let models = db::models::list_models().expect("Failed to list models");

    Json(models)
}

#[get("/models/<model_id>")]
fn get_model(model_id: &str) -> Json<ModelRecord> {
    let model = db::models::get_model(&model_id).expect("Failed to retrieve model");

    Json(model)
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
    ]
}
