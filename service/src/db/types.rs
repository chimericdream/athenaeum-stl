use diesel::prelude::*;
use rocket::serde::{Deserialize, Serialize};

#[derive(Deserialize, Identifiable, Debug, Queryable, Selectable, Serialize)]
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
    pub deleted: bool,
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
    pub metadata: Option<ModelMetadata>,
    pub deleted: bool,
}

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
pub struct ModelWithMetadata {
    pub id: String,
    pub name: String,
    pub thumbnail: Option<String>,
    pub imported_at: String,
    pub part_count: i32,
    pub image_count: i32,
    pub project_count: i32,
    pub support_file_count: i32,
    pub metadata: Option<ModelMetadata>,
    pub labels: Vec<ModelLabel>,
    pub deleted: bool,
}

#[derive(Associations, AsChangeset, Deserialize, Debug, Insertable, Queryable, Selectable, Serialize)]
#[diesel(table_name = crate::db::schema::model_metadata)]
#[diesel(belongs_to(Model))]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
#[serde(crate = "rocket::serde")]
pub struct ModelMetadata {
    pub model_id: String,
    pub description: Option<String>,
    pub source_url: Option<String>,
    pub commercial_use: Option<bool>,
    pub nsfw: Option<bool>,
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
    pub deleted: bool,
}

#[derive(AsChangeset, Deserialize)]
#[diesel(table_name = crate::db::schema::file_records)]
#[serde(crate = "rocket::serde")]
pub struct FileUpdate<'a> {
    pub name: Option<&'a str>,
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

#[derive(AsChangeset, Deserialize)]
#[diesel(table_name = crate::db::schema::labels)]
#[serde(crate = "rocket::serde")]
pub struct LabelUpdate<'a> {
    pub name: Option<&'a str>,
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
