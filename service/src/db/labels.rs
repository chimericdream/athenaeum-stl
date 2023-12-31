use diesel::expression::AsExpression;
use uuid::Uuid;
use diesel::prelude::*;
use rocket::serde::{Deserialize, Serialize};
use crate::db::{establish_connection};
use crate::db::types::{Label, LabelUpdate, NewLabel};

#[derive(Deserialize, Serialize)]
#[serde(crate = "rocket::serde")]
pub struct LabelEntry {
    pub id: String,
    pub name: String,
    pub model_count: i64,
}

#[derive(Deserialize, Serialize)]
#[serde(crate = "rocket::serde")]
pub struct LabelRecord {
    pub id: String,
    pub name: String,
    pub models: Vec<String>,
}

pub fn list_labels() -> Result<Vec<LabelEntry>, diesel::result::Error> {
    use crate::db::schema::labels::dsl::*;

    let connection = &mut establish_connection();
    let entries = labels.load::<Label>(connection);

    let mut label_entries: Vec<LabelEntry> = Vec::new();
    for label in entries.unwrap() {
        let model_count = count_models_for_label(&label.id).unwrap();
        let label_entry = LabelEntry {
            id: label.id,
            name: label.name,
            model_count,
        };
        label_entries.push(label_entry);
    };

    Ok(label_entries)
}

pub fn count_models_for_label(label_id: &str) -> Result<i64, diesel::result::Error> {
    use crate::db::schema::*;

    let connection = &mut establish_connection();
    model_labels::table
        .filter(model_labels::label_id.eq(label_id))
        .count()
        .get_result(connection)
}

pub fn update_label(id: &str, label: &LabelUpdate) -> Result<LabelEntry, Box<dyn std::error::Error>> {
    use crate::db::schema::*;

    let connection = &mut establish_connection();
    diesel::update(labels::table)
        .set(label)
        .filter(labels::id.eq(id))
        .returning(Label::as_returning())
        .execute(connection)?;

    get_label(id)
}

pub fn get_label_details(id: &str) -> Result<LabelRecord, Box<dyn std::error::Error>> {
    use crate::db::schema::*;
    use crate::db::types::*;

    let connection = &mut establish_connection();
    let label = labels::table
        .filter(labels::id.eq(id))
        .select(Label::as_select())
        .get_result(connection)?;

    let models: Vec<String> = model_labels::table
        .filter(model_labels::label_id.eq(id))
        .select(model_labels::model_id.as_expression())
        .load(connection)?;

    Ok(LabelRecord {
        id: label.id,
        name: label.name,
        models,
    })
}

pub fn get_label(id: &str) -> Result<LabelEntry, Box<dyn std::error::Error>> {
    use crate::db::schema::*;
    use crate::db::types::*;

    let connection = &mut establish_connection();
    let label = labels::table
        .filter(labels::id.eq(id))
        .select(Label::as_select())
        .get_result(connection)?;

    let model_count = count_models_for_label(&id).unwrap();

    Ok(LabelEntry {
        id: label.id,
        name: label.name,
        model_count,
    })
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
