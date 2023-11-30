use athenaeum_server::db::establish_connection;
use athenaeum_server::db::types::Model;
use diesel::prelude::*;
use std::env::args;

fn main() {
    use athenaeum_server::db::schema::models::dsl::{models, name};

    let id = args().nth(1).expect("rename_model requires a model id");
    let new_name = args().nth(2).expect("rename_model requires a new name");

    let connection = &mut establish_connection();

    let model = diesel::update(models.find(id))
        .set(name.eq(new_name))
        .returning(Model::as_returning())
        .get_result(connection)
        .unwrap();
    log::info!("Updated model {}", model.name);
}
