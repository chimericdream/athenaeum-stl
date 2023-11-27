use athenaeum_import::db::establish_connection;
use athenaeum_import::db::types::Model;
use diesel::prelude::*;

fn main() {
    use athenaeum_import::db::schema::models::dsl::*;

    let connection = &mut establish_connection();
    let results: Vec<Model> = models.load(connection).expect("Error loading models");

    log::info!("Displaying {} models", results.len());
    for model in results {
        log::info!("{}: {}", model.id, model.name);
    }
}
