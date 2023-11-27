use athenaeum_import::db::{create_model, establish_connection};
use std::io::stdin;
use uuid::Uuid;

fn main() {
    let connection = &mut establish_connection();

    let mut name = String::new();
    let id = Uuid::new_v4().to_string();

    log::info!("What would you like the name to be?");
    stdin().read_line(&mut name).unwrap();
    let clean_name = name.trim_end(); // Remove the trailing newline

    let model = create_model(connection, &id, clean_name);
    log::info!("\nSaved model {} with id {}", clean_name, model.id);
}
