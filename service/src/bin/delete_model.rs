use diesel::prelude::*;
use std::env::args;
use athenaeum_import::db::establish_connection;

fn main() {
    use athenaeum_import::db::schema::models::dsl::*;

    let target = args().nth(1).expect("Expected a target to match against");
    let pattern = format!("%{}%", target);

    let connection = &mut establish_connection();
    let num_deleted = diesel::delete(models.filter(name.like(pattern)))
        .execute(connection)
        .expect("Error deleting models");

    println!("Deleted {} models", num_deleted);
}
