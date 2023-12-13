use rocket::Route;

mod labels;
mod models;
mod files;

pub fn routes() -> Vec<Route> {
    let mut routes = Vec::new();
    routes.append(&mut labels::routes());
    routes.append(&mut models::routes());
    routes.append(&mut files::routes());
    routes
}
