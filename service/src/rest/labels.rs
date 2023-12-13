use rocket::{get, post, routes};
use rocket::Route;
use rocket::serde::Deserialize;
use rocket::serde::json::Json;
use crate::db;
use crate::db::types::Label;

#[derive(Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct NewLabel {
    pub name: String,
}

#[get("/labels")]
fn get_labels() -> Json<Vec<Label>> {
    let labels = db::labels::list_labels().expect("Failed to list labels");

    Json(labels)
}

#[post("/labels", data = "<data>")]
fn create_label(data: Json<NewLabel>) -> Json<Label> {
    let label = db::labels::create_label(&data.name).expect("Failed to create label");

    Json(label)
}

pub fn routes() -> Vec<Route> {
    routes![
        get_labels,
        create_label,
    ]
}
