use crate::schema::models;
use diesel::prelude::*;

#[derive(Identifiable, Queryable, Selectable)]
#[diesel(table_name = crate::schema::models)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Model {
    pub id: String,
    pub name: String,
    pub thumbnail: Option<String>,
    pub imported_at: String,
    pub part_count: i32,
    pub image_count: i32,
    pub project_count: i32,
}

#[derive(Insertable)]
#[diesel(table_name = models)]
pub struct NewModel<'a> {
    pub id: &'a str,
    pub name: &'a str,
}

#[derive(Identifiable, Queryable, Selectable)]
#[diesel(table_name = crate::schema::file_records)]
#[diesel(belongs_to(Model))]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct FileRecord {
    pub id: String,
    pub name: String,
    pub thumbnail: Option<String>,
    pub category: String,
    pub imported_at: String,
    pub model_id: String,
}

#[derive(Identifiable, Queryable, Selectable)]
#[diesel(table_name = crate::schema::labels)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Label {
    pub id: String,
    pub name: String,
}

#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::schema::model_labels)]
#[diesel(belongs_to(Label))]
#[diesel(belongs_to(Model))]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct ModelLabel {
    pub model_id: String,
    pub label_id: String,
}
