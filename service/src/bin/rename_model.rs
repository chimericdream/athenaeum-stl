use self::models::Model;
use diesel::prelude::*;
use stllib_import::*;
use std::env::args;

fn main() {
    use self::schema::models::dsl::{models, name};

    let id = args()
        .nth(1)
        .expect("rename_model requires a model id");
    let new_name = args()
        .nth(2)
        .expect("rename_model requires a new name");

    let connection = &mut establish_connection();

    let model = diesel::update(models.find(id))
        .set(name.eq(new_name))
        .returning(Model::as_returning())
        .get_result(connection)
        .unwrap();
    println!("Updated model {}", model.name);
}
