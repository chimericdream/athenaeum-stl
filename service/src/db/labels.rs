use uuid::Uuid;
use diesel::prelude::*;
use crate::db::{establish_connection};
use crate::db::types::{Label, ModelLabel, NewLabel};

// pub fn add_model_to_db(name: &str, id: &Uuid) {
//     let connection = &mut establish_connection();
//
//     use crate::db::schema::models;
//
//     let new_model = NewModel { id: &id.hyphenated().to_string(), name: &name };
//
//     let model = diesel::insert_into(models::table)
//         .values(&new_model)
//         .returning(Model::as_returning())
//         .get_result(connection)
//         .expect("Error saving new model");
//
//     log::info!("\nSaved model {} with id {}", name, model.id);
// }

pub fn list_labels() -> Result<Vec<Label>, diesel::result::Error> {
    use crate::db::schema::labels::dsl::*;

    let connection = &mut establish_connection();
    labels.load(connection)
}

pub fn create_label(label_name: &str) -> Result<Label, diesel::result::Error> {
    use crate::db::schema::labels::dsl::*;

    let new_id = Uuid::new_v4().hyphenated().to_string();

    let connection = &mut establish_connection();
    let new_label = NewLabel {
        id: &new_id,
        name: &label_name,
    };

    diesel::insert_into(labels)
        .values(&new_label)
        .returning(Label::as_returning())
        .get_result(connection)
}

/*
POST /labels -> create_label
    {"name": "..."}
GET /labels -> list_labels
PUT /labels/<label_id> -> update_label
    {"name": "..."}
GET /models/<model_id>/labels -> get_labels_for_model
PUT /models/<model_id>/labels -> add_label_to_model
    {"id": "..."} -> add an existing label
    {"name": "..."} -> create a new label and add it
DELETE /models/<model_id>/labels/<label_id> -> remove_label_from_model
 */

//
// pub fn update_model(id: &str, model: &ModelUpdate) -> Result<ModelRecord, Box<dyn std::error::Error>> {
//     use crate::db::schema::*;
//
//     let connection = &mut establish_connection();
//     diesel::update(models::table)
//         .set(model)
//         .filter(models::id.eq(id))
//         .returning(Model::as_returning())
//         .execute(connection)?;
//
//     get_model(id)
// }
//
// pub fn get_model(id: &str) -> Result<ModelRecord, Box<dyn std::error::Error>> {
//     use crate::db::schema::*;
//     use crate::db::types::*;
//
//     let connection = &mut establish_connection();
//     let model = models::table
//         .filter(models::id.eq(id))
//         .select(Model::as_select())
//         .get_result(connection)?;
//
//     let files = FileRecord::belonging_to(&model)
//         .select(FileRecord::as_select())
//         .load(connection)?;
//
//     let labels = model_labels::table
//         .filter(model_labels::model_id.eq(id))
//         .select(ModelLabel::as_select())
//         .load(connection)?;
//
//     let mut model_record = ModelRecord {
//         id: model.id,
//         name: model.name,
//         thumbnail: model.thumbnail,
//         imported_at: model.imported_at,
//         images: vec![],
//         parts: vec![],
//         projects: vec![],
//         support_files: vec![],
//         labels,
//     };
//
//     for file in files {
//         match file.category.as_str() {
//             "image" => {
//                 model_record.images.push(file);
//             },
//             "part" => {
//                 model_record.parts.push(file);
//             },
//             "project" => {
//                 model_record.projects.push(file);
//             },
//             "support" => {
//                 model_record.support_files.push(file);
//             },
//             _ => (),
//         }
//     }
//
//     Ok(model_record)
// }
