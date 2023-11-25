use diesel::prelude::*;
use std::env::args;
use athenaeum_import::db::establish_connection;
use athenaeum_import::db::types::Model;

fn main() {
    use athenaeum_import::db::schema::models::dsl::models;

    let model_id = args()
        .nth(1)
        .expect("get_post requires a post id");

    let connection = &mut establish_connection();

    let model = models
        .find(&model_id)
        .select(Model::as_select())
        .first(connection)
        .optional(); // This allows for returning an Option<Post>, otherwise it will throw an error

    match model {
        Ok(Some(model)) => println!("Model with id: {} has a name: {}", model.id, model.name),
        Ok(None) => println!("Unable to find model {}", model_id),
        Err(_) => println!("An error occured while fetching model {}", model_id),
    }
}
