use uuid::Uuid;
use diesel::prelude::*;
use crate::db::{establish_connection};
use crate::db::types::{FileRecord, FileUpdate, NewFileRecord};
use crate::util::make_id;

pub enum FileCategory {
    Image,
    Part,
    Project,
    Support
}

pub fn update_file(id: &str, file: &FileUpdate) -> Result<FileRecord, Box<dyn std::error::Error>> {
    use crate::db::schema::*;

    let connection = &mut establish_connection();
    diesel::update(file_records::table)
        .set(file)
        .filter(file_records::id.eq(id))
        .returning(FileRecord::as_returning())
        .execute(connection)?;

    get_file(id)
}

pub fn get_file(id: &str) -> Result<FileRecord, Box<dyn std::error::Error>> {
    use crate::db::schema::*;
    use crate::db::types::*;

    let connection = &mut establish_connection();
    let file = file_records::table
        .filter(file_records::id.eq(id))
        .select(FileRecord::as_select())
        .get_result(connection)?;

    Ok(file)
}

pub fn add_file_to_model(name: &str, size: u64, model_id: &Uuid, category: FileCategory) {
    let connection = &mut establish_connection();

    use crate::db::schema::{file_records, models};

    let id = make_id();

    let safe_size = size as i64;

    let new_model = NewFileRecord {
        id: &id.hyphenated().to_string(),
        name: &name,
        file_name: &name,
        file_size: &safe_size,
        category: match category {
            FileCategory::Image => "image",
            FileCategory::Part => "part",
            FileCategory::Project => "project",
            FileCategory::Support => "support",
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
                .expect("Error updating file count on model");
        },
        FileCategory::Part => {
            diesel::update(models::table)
                .set(models::part_count.eq(models::part_count + 1))
                .filter(models::id.eq(&model_id.hyphenated().to_string()))
                .execute(connection)
                .expect("Error updating file count on model");
        },
        FileCategory::Project => {
            diesel::update(models::table)
                .set(models::project_count.eq(models::project_count + 1))
                .filter(models::id.eq(&model_id.hyphenated().to_string()))
                .execute(connection)
                .expect("Error updating file count on model");
        },
        FileCategory::Support => {
            diesel::update(models::table)
                .set(models::support_file_count.eq(models::support_file_count + 1))
                .filter(models::id.eq(&model_id.hyphenated().to_string()))
                .execute(connection)
                .expect("Error updating file count on model");
        }
    };

    log::info!("\nSaved file {} with id {}", name, record.id);
}
