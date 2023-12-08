pub mod schema;
pub mod types;
pub mod labels;
pub mod models;
pub mod model_files;

use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use std::error::Error;
use crate::util::get_exe_dir;

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
