use diesel::prelude::*;
use rocket::serde::{Deserialize, Serialize};

#[derive(Identifiable, Debug, Queryable, Selectable, Serialize)]
#[diesel(table_name = crate::db::schema::models)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
#[serde(crate = "rocket::serde")]
pub struct Model {
    pub id: String,
    pub name: String,
    pub thumbnail: Option<String>,
    pub imported_at: String,
    pub part_count: i32,
    pub image_count: i32,
    pub project_count: i32,
    pub support_file_count: i32,
}

#[derive(AsChangeset, Deserialize)]
#[diesel(table_name = crate::db::schema::models)]
#[serde(crate = "rocket::serde")]
pub struct ModelUpdate<'a> {
    pub name: Option<&'a str>,
}

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
pub struct ModelRecord {
    pub id: String,
    pub name: String,
    pub thumbnail: Option<String>,
    pub imported_at: String,
    pub parts: Vec<FileRecord>,
    pub images: Vec<FileRecord>,
    pub projects: Vec<FileRecord>,
    pub support_files: Vec<FileRecord>,
    pub labels: Vec<ModelLabel>,
}

#[derive(Insertable)]
#[diesel(table_name = crate::db::schema::models)]
pub struct NewModel<'a> {
    pub id: &'a str,
    pub name: &'a str,
}

#[derive(Associations, Debug, Identifiable, Queryable, Selectable, Serialize)]
#[diesel(table_name = crate::db::schema::file_records)]
#[diesel(belongs_to(Model))]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
#[serde(crate = "rocket::serde")]
pub struct FileRecord {
    pub id: String,
    pub name: String,
    pub file_name: String,
    pub file_size: i64,
    pub thumbnail: Option<String>,
    pub category: String,
    pub imported_at: String,
    pub model_id: String,
}

#[derive(Insertable)]
#[diesel(table_name = crate::db::schema::file_records)]
pub struct NewFileRecord<'a> {
    pub id: &'a str,
    pub name: &'a str,
    pub file_name: &'a str,
    pub file_size: &'a i64,
    pub category: &'a str,
    pub model_id: &'a str,
}

#[derive(Identifiable, Debug, Deserialize, Queryable, Selectable, Serialize)]
#[diesel(table_name = crate::db::schema::labels)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
#[serde(crate = "rocket::serde")]
pub struct Label {
    pub id: String,
    pub name: String,
}

#[derive(Deserialize, Insertable, Serialize)]
#[diesel(table_name = crate::db::schema::labels)]
#[serde(crate = "rocket::serde")]
pub struct NewLabel<'a> {
    pub id: &'a str,
    pub name: &'a str,
}

#[derive(Associations, Debug, Queryable, Selectable, Serialize)]
#[diesel(table_name = crate::db::schema::model_labels)]
#[diesel(belongs_to(Label))]
#[diesel(belongs_to(Model))]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
#[serde(crate = "rocket::serde")]
pub struct ModelLabel {
    pub model_id: String,
    pub label_id: String,
}
