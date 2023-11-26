use athenaeum_import::{db, scanner};

fn main() {
    println!("Hello, world!");
    db::init();
    scanner::init();
}
