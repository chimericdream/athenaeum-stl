use std::env;
use std::io;
use std::path::PathBuf;
use std::fs::{DirBuilder};

fn create_dir(dir: &PathBuf) -> io::Result<()> {
    DirBuilder::new()
        .recursive(true)
        .create(&dir)?;
    Ok(())
}

pub fn init() {
    println!("Initializing scanner...");

    let mut dir = env::current_exe().expect("Failed to get exe dir");
    dir.pop();

    let mut import_dir = dir.clone();
    let mut ignore_dir = dir.clone();
    let mut library_dir = dir.clone();

    import_dir.push("import");
    ignore_dir.push("ignored");
    library_dir.push(".library");

    create_dir(&import_dir).expect("Failed to create import directory");
    create_dir(&ignore_dir).expect("Failed to create ignore directory");
    create_dir(&library_dir).expect("Failed to create library directory");
}
