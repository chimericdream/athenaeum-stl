use uuid::Uuid;
use diesel::prelude::*;
use crate::db::{establish_connection};
use crate::db::types::{FileRecord, NewFileRecord};
use crate::util::make_id;

pub enum FileCategory {
    Image,
    Part,
    Project
}

pub fn add_file_to_model(name: &str, model_id: &Uuid, category: FileCategory) {
    let connection = &mut establish_connection();

    use crate::db::schema::{file_records, models};

    let id = make_id();

    let new_model = NewFileRecord {
        id: &id.hyphenated().to_string(),
        name: &name,
        category: match category {
            FileCategory::Image => "image",
            FileCategory::Part => "part",
            FileCategory::Project => "project"
        },
        model_id: &model_id.hyphenated().to_string()
    };

    let record = diesel::insert_into(file_records::table)
        .values(&new_model)
        .returning(FileRecord::as_returning())
        .get_result(connection)
        .expect("Error saving new file record");

    match category {
        FileCategory::Image => {
            diesel::update(models::table)
                .set(models::image_count.eq(models::image_count + 1))
                .filter(models::id.eq(&model_id.hyphenated().to_string()))
                .execute(connection)
                .expect("Error updating model image");
        },
        FileCategory::Part => {
            diesel::update(models::table)
                .set(models::part_count.eq(models::part_count + 1))
                .filter(models::id.eq(&model_id.hyphenated().to_string()))
                .execute(connection)
                .expect("Error updating model image");
        },
        FileCategory::Project => {
            diesel::update(models::table)
                .set(models::project_count.eq(models::project_count + 1))
                .filter(models::id.eq(&model_id.hyphenated().to_string()))
                .execute(connection)
                .expect("Error updating model image");
        }
    }

    log::info!("\nSaved file {} with id {}", name, record.id);
}
