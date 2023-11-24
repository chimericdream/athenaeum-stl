use self::models::*;
use diesel::prelude::*;
use stllib_import::*;

fn main() {
    use self::schema::models::dsl::*;

    let connection = &mut establish_connection();
    let results: Vec<Model> = models
        .load(connection)
        .expect("Error loading models");

    println!("Displaying {} models", results.len());
    for model in results {
        println!("{}", model.name);
        println!("-----------\n");
        println!("{}", model.id);
    }
}
