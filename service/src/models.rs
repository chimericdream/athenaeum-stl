#![allow(non_snake_case)]

use diesel::prelude::*;

#[derive(Identifiable, Queryable, Selectable)]
#[diesel(table_name = crate::schema::models)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Model {
    pub id: String,
    pub name: String,
    pub thumbnail: Option<String>,

    #[diesel(column_name = imported_at)]
    pub importedAt: String,

    #[diesel(column_name = part_count)]
    pub partCount: i32,

    #[diesel(column_name = image_count)]
    pub imageCount: i32,

    #[diesel(column_name = project_count)]
    pub projectCount: i32,
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

    #[diesel(column_name = imported_at)]
    pub importedAt: String,

    #[diesel(column_name = model_id)]
    pub modelId: String,
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
    #[diesel(column_name = model_id)]
    pub modelId: String,
    #[diesel(column_name = label_id)]
    pub labelId: String,
}
