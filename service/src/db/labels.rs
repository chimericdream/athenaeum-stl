use uuid::Uuid;
use diesel::prelude::*;
use crate::db::{establish_connection};
use crate::db::types::{Label, NewLabel};

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
