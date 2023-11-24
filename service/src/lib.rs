pub mod models;
pub mod schema;

use diesel::sqlite::SqliteConnection;
use diesel::prelude::*;
use dotenvy::dotenv;
use std::env;
use self::models::{Model, NewModel};

pub fn establish_connection() -> SqliteConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    SqliteConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}


pub fn create_model(conn: &mut SqliteConnection, id: &str, name: &str) -> Model {
    use crate::schema::models;

    let new_model = NewModel { id, name };

    diesel::insert_into(models::table)
        .values(&new_model)
        .returning(Model::as_returning())
        .get_result(conn)
        .expect("Error saving new model")
}
