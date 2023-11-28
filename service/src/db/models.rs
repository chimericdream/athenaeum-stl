use uuid::Uuid;
use diesel::prelude::*;
use crate::db::{establish_connection};
use crate::db::types::{Model, NewModel};

pub fn add_model_to_db(name: &str, id: &Uuid) {
    let connection = &mut establish_connection();

    use crate::db::schema::models;

    let new_model = NewModel { id: &id.hyphenated().to_string(), name: &name };

    let model = diesel::insert_into(models::table)
        .values(&new_model)
        .returning(Model::as_returning())
        .get_result(connection)
        .expect("Error saving new model");

    log::info!("\nSaved model {} with id {}", name, model.id);
}
