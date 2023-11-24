use diesel::prelude::*;
use stllib_import::*;
use std::env::args;

fn main() {
    use self::schema::models::dsl::*;

    let target = args().nth(1).expect("Expected a target to match against");
    let pattern = format!("%{}%", target);

    let connection = &mut establish_connection();
    let num_deleted = diesel::delete(models.filter(name.like(pattern)))
        .execute(connection)
        .expect("Error deleting models");

    println!("Deleted {} models", num_deleted);
}
