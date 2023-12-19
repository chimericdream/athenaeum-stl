use std::fmt::Display;
use std::path::PathBuf;
use uuid::Uuid;
use diesel::prelude::*;
use std::str::FromStr;
use crate::db::{establish_connection};
use crate::db::types::{FileRecord, FileUpdate, NewFileRecord};
use crate::util::make_id;

pub enum FileCategory {
    Image,
    Part,
    Project,
    Support
}

impl Display for FileCategory {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let str = match self {
            FileCategory::Image => String::from("image"),
            FileCategory::Part => String::from("part"),
            FileCategory::Project => String::from("project"),
            FileCategory::Support => String::from("support"),
        };
        write!(f, "{}", str)
    }
}

impl FromStr for FileCategory {
    type Err = ();

    fn from_str(input: &str) -> Result<FileCategory, Self::Err> {
        match input {
            "image" => Ok(FileCategory::Image),
            "part" => Ok(FileCategory::Part),
            "project" => Ok(FileCategory::Project),
            "support" => Ok(FileCategory::Support),
            _      => Err(()),
        }
    }
}

pub fn get_file_category(file_name: &str) -> Option<FileCategory> {
    let path = PathBuf::from(file_name);

    match path.extension().unwrap().to_str().unwrap().to_lowercase().as_str() {
        "stl" | "obj" | "gcode" | "3mf" | "scad" => Some(FileCategory::Part),
        "txt" | "pdf" | "zip" | "7z" | "html" => Some(FileCategory::Support),
        "dxf" | "blend" | "123dx" | "skp" | "f3d" | "step" | "f3z" => Some(FileCategory::Project),
        "jpg" | "jpeg" | "png" | "webp" | "gif" | "heic" => Some(FileCategory::Image),
        _ => None,
    }
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

pub fn move_file_to_new_model(file_id: &str, new_model_id: &Uuid) -> Result<FileRecord, Box<dyn std::error::Error>> {
    let connection = &mut establish_connection();

    use crate::db::schema::{file_records, models};

    let file = get_file(&file_id).expect("Failed to get file");
    let old_model_id = file.model_id;

    let category = FileCategory::from_str(&file.category).expect("Failed to parse file category");

    match category {
        FileCategory::Image => {
            diesel::update(models::table)
                .set(models::image_count.eq(models::image_count + 1))
                .filter(models::id.eq(&new_model_id.hyphenated().to_string()))
                .execute(connection)
                .expect("Error updating file count on old model");

            diesel::update(models::table)
                .set(models::image_count.eq(models::image_count - 1))
                .filter(models::id.eq(&old_model_id))
                .execute(connection)
                .expect("Error updating file count on old model");
        },
        FileCategory::Part => {
            diesel::update(models::table)
                .set(models::part_count.eq(models::part_count + 1))
                .filter(models::id.eq(&new_model_id.hyphenated().to_string()))
                .execute(connection)
                .expect("Error updating file count on old model");

            diesel::update(models::table)
                .set(models::part_count.eq(models::part_count - 1))
                .filter(models::id.eq(&old_model_id))
                .execute(connection)
                .expect("Error updating file count on old model");
        },
        FileCategory::Project => {
            diesel::update(models::table)
                .set(models::project_count.eq(models::project_count + 1))
                .filter(models::id.eq(&new_model_id.hyphenated().to_string()))
                .execute(connection)
                .expect("Error updating file count on old model");

            diesel::update(models::table)
                .set(models::project_count.eq(models::project_count - 1))
                .filter(models::id.eq(&old_model_id))
                .execute(connection)
                .expect("Error updating file count on old model");
        },
        FileCategory::Support => {
            diesel::update(models::table)
                .set(models::support_file_count.eq(models::support_file_count + 1))
                .filter(models::id.eq(&new_model_id.hyphenated().to_string()))
                .execute(connection)
                .expect("Error updating file count on old model");

            diesel::update(models::table)
                .set(models::support_file_count.eq(models::support_file_count - 1))
                .filter(models::id.eq(&old_model_id))
                .execute(connection)
                .expect("Error updating file count on old model");
        }
    };

    diesel::update(file_records::table)
        .set(file_records::model_id.eq(new_model_id.hyphenated().to_string()))
        .filter(file_records::id.eq(file_id))
        .returning(FileRecord::as_returning())
        .execute(connection)?;

    get_file(file_id)
}
