use diesel::prelude::*;
use athenaeum_import::db::establish_connection;
use athenaeum_import::db::types::Model;

fn main() {
    use athenaeum_import::db::schema::models::dsl::*;

    let connection = &mut establish_connection();
    let results: Vec<Model> = models
        .load(connection)
        .expect("Error loading models");

    println!("Displaying {} models", results.len());
    for model in results {
        println!("{}: {}", model.id, model.name);
    }
}
