use rocket::{get, patch, post, routes};
use rocket::Route;
use rocket::serde::Deserialize;
use rocket::serde::json::Json;
use crate::db;
use crate::db::labels::{LabelEntry, LabelRecord};
use crate::db::types::{Label, LabelUpdate};

#[derive(Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct NewLabel {
    pub name: String,
}

#[get("/labels")]
fn get_labels() -> Json<Vec<LabelEntry>> {
    let labels = db::labels::list_labels().expect("Failed to list labels");

    Json(labels)
}

#[get("/labels/<label_id>")]
fn load_label(label_id: &str) -> Json<LabelRecord> {
    let label = db::labels::get_label_details(&label_id).expect("Failed to update model");

    Json(label)
}

#[patch("/labels/<label_id>", data = "<data>")]
fn update_label(label_id: &str, data: Json<LabelUpdate>) -> Json<LabelEntry> {
    let updated_label = db::labels::update_label(&label_id, &data).expect("Failed to update model");

    Json(updated_label)
}

#[post("/labels", data = "<data>")]
fn create_label(data: Json<NewLabel>) -> Json<Label> {
    let label = db::labels::create_label(&data.name).expect("Failed to create label");

    Json(label)
}

pub fn routes() -> Vec<Route> {
    routes![
        get_labels,
        load_label,
        create_label,
        update_label,
    ]
}
