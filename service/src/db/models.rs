use uuid::Uuid;
use diesel::prelude::*;
use crate::db::{establish_connection};
use crate::db::types::{Model, ModelMetadata, ModelRecord, ModelUpdate, ModelWithMetadata, NewModel};

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

pub fn list_models(is_deleted: bool) -> Result<Vec<ModelWithMetadata>, diesel::result::Error> {
    use crate::db::schema::*;

    let connection = &mut establish_connection();
    let model_list = models::table
        .filter(models::deleted.eq(is_deleted))
        .select(Model::as_select())
        .load(connection);

    let mut models_with_metadata = vec![];
    for model in model_list? {
        let metadata = model_metadata::table
            .filter(model_metadata::model_id.eq(&model.id))
            .select(ModelMetadata::as_select())
            .get_result(connection)
            .optional()?;

        let model_with_metadata = ModelWithMetadata {
            id: model.id,
            name: model.name,
            thumbnail: model.thumbnail,
            imported_at: model.imported_at,
            part_count: model.part_count,
            image_count: model.image_count,
            project_count: model.project_count,
            support_file_count: model.support_file_count,
            metadata,
            deleted: model.deleted,
        };

        models_with_metadata.push(model_with_metadata);
    };

    Ok(models_with_metadata)
}

pub fn add_label_to_model(model_id: &str, label_id: &str) -> Option<ModelRecord> {
    use crate::db::schema::*;

    let connection = &mut establish_connection();
    diesel::insert_into(model_labels::table)
        .values((model_labels::model_id.eq(model_id), model_labels::label_id.eq(label_id)))
        .execute(connection).ok()?;

    get_model(model_id, false)
}

pub fn update_model(id: &str, model: &ModelUpdate) -> Option<ModelRecord> {
    use crate::db::schema::*;

    let connection = &mut establish_connection();
    diesel::update(models::table)
        .set(model)
        .filter(models::id.eq(id))
        .returning(Model::as_returning())
        .execute(connection).ok()?;

    get_model(id, false)
}

pub fn update_metadata(id: &str, metadata: &ModelMetadata) -> Option<ModelRecord> {
    use crate::db::schema::*;

    let connection = &mut establish_connection();
    diesel::insert_into(model_metadata::table)
        .values(metadata)
        .on_conflict(model_metadata::model_id)
        .do_update()
        .set(metadata)
        .execute(connection).ok()?;

    get_model(id, false)
}

pub fn delete_model(id: &str) -> Result<(), Box<dyn std::error::Error>> {
    use crate::db::schema::*;

    let connection = &mut establish_connection();
    diesel::update(models::table)
        .set(models::deleted.eq(true))
        .filter(models::id.eq(id))
        .execute(connection)?;

    Ok(())
}

pub fn get_model(id: &str, include_deleted: bool) -> Option<ModelRecord> {
    use crate::db::schema::*;
    use crate::db::types::*;

    let connection = &mut establish_connection();
    let model = models::table
        .filter(models::id.eq(id))
        .select(Model::as_select())
        .get_result(connection).ok()?;

    if model.deleted && !include_deleted {
        return None;
    }

    let files = FileRecord::belonging_to(&model)
        .filter(file_records::deleted.ne(true))
        .select(FileRecord::as_select())
        .load(connection).ok()?;

    let labels = model_labels::table
        .filter(model_labels::model_id.eq(id))
        .select(ModelLabel::as_select())
        .load(connection).ok()?;

    let metadata = model_metadata::table
        .filter(model_metadata::model_id.eq(id))
        .select(ModelMetadata::as_select())
        .get_result(connection)
        .optional().ok()?;

    let mut model_record = ModelRecord {
        id: model.id.clone(),
        name: model.name,
        thumbnail: model.thumbnail,
        imported_at: model.imported_at,
        images: vec![],
        parts: vec![],
        projects: vec![],
        support_files: vec![],
        labels,
        metadata,
    };

    if model_record.metadata.is_none() {
        model_record.metadata = Some(ModelMetadata {
            model_id: model.id.clone(),
            description: None,
            source_url: None,
            commercial_use: None,
            nsfw: None,
        });
    }

    for file in files {
        match file.category.as_str() {
            "image" => {
                model_record.images.push(file);
            },
            "part" => {
                model_record.parts.push(file);
            },
            "project" => {
                model_record.projects.push(file);
            },
            "support" => {
                model_record.support_files.push(file);
            },
            _ => (),
        }
    }

    Some(model_record)
}
