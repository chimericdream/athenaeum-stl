use self::types::{Model, NewModel};
use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use std::error::Error;
use crate::util::get_exe_dir;

pub mod schema;
pub mod types;
pub mod models;

pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!("./migrations");

fn run_migrations(
    conn: &mut SqliteConnection,
) -> Result<(), Box<dyn Error + Send + Sync + 'static>> {
    conn.run_pending_migrations(MIGRATIONS)?;
    Ok(())
}

pub fn init() {
    log::info!("Initializing database...");

    let connection = &mut establish_connection();
    run_migrations(connection).expect("Failed to run migrations");
}

pub fn establish_connection() -> SqliteConnection {
    let mut db_loc = get_exe_dir().expect("Failed to get exe dir");
    db_loc.push("athenaeum.db");

    let database_url = db_loc.to_str().unwrap();

    SqliteConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}

pub fn create_model(conn: &mut SqliteConnection, id: &str, name: &str) -> Model {
    use crate::db::schema::models;

    let new_model = NewModel { id, name };

    diesel::insert_into(models::table)
        .values(&new_model)
        .returning(Model::as_returning())
        .get_result(conn)
        .expect("Error saving new model")
}
