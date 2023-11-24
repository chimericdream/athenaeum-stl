use stllib_import::*;
use std::io::{stdin};
use uuid::Uuid;

fn main() {
    let connection = &mut establish_connection();

    let mut name = String::new();
    let id = Uuid::new_v4().to_string();

    println!("What would you like the name to be?");
    stdin().read_line(&mut name).unwrap();
    let clean_name = name.trim_end(); // Remove the trailing newline

    let model = create_model(connection, &id, clean_name);
    println!("\nSaved model {} with id {}", clean_name, model.id);
}
