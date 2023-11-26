use diesel::sqlite::SqliteConnection;
use diesel::prelude::*;
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use std::env;
use std::error::Error;
use self::types::{Model, NewModel};
use std::io;
use std::path::PathBuf;

pub mod types;
pub mod schema;

pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!("./migrations");

fn get_exe_dir() -> io::Result<PathBuf> {
    let mut dir = env::current_exe()?;
    dir.pop();
    Ok(dir)
}

fn run_migrations(conn: &mut SqliteConnection) -> Result<(), Box<dyn Error + Send + Sync + 'static>> {
    conn.run_pending_migrations(MIGRATIONS)?;
    Ok(())
}

pub fn init() {
    println!("Initializing database...");

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
