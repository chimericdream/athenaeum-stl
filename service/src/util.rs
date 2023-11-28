use std::env;
use std::io;
use std::path::PathBuf;
use std::fs::{create_dir_all};
use uuid::{Uuid};

pub fn make_id() -> Uuid {
    Uuid::new_v4()
}

pub fn get_exe_dir() -> io::Result<PathBuf> {
    let mut dir = env::current_exe()?;
    dir.pop();
    Ok(dir)
}

pub fn get_ignore_dir() -> io::Result<PathBuf> {
    let mut dir = get_exe_dir()?;
    dir.push("ignored");
    Ok(dir)
}

pub fn get_import_dir() -> io::Result<PathBuf> {
    let mut dir = get_exe_dir()?;
    dir.push("import");
    Ok(dir)
}

pub fn get_library_dir() -> io::Result<PathBuf> {
    let mut dir = get_exe_dir()?;
    dir.push(".library");
    Ok(dir)
}

pub fn ensure_tree(path: &PathBuf) -> io::Result<()> {
    let file_name = path.file_name().unwrap().to_str().unwrap();
    let mut final_dir = path.clone();
    final_dir.pop();

    create_dir_all(&final_dir).expect(format!("Failed to create destination directory '{}' for ignored file '{}'", path.to_str().unwrap(), file_name).as_str());

    Ok(())
}
