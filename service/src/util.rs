use std::env;
use std::io;
use std::path::PathBuf;
use std::fs::{create_dir_all};
use uuid::{Uuid};

pub fn make_id() -> Uuid {
    Uuid::new_v4()
}

pub fn get_model_dir(model_id: &str) -> io::Result<PathBuf> {
    let folder_1 = model_id[0..2].to_string();
    let folder_2 = model_id[2..4].to_string();

    let library_dir = get_library_dir()?;

    let mut final_path = library_dir.clone();
    final_path.push(folder_1);
    final_path.push(folder_2);
    final_path.push(model_id);

    Ok(final_path)
}

pub fn get_file_path(model_id: &str, file_type: &str, file_name: &str) -> io::Result<PathBuf> {
    let mut final_path = get_model_dir(&model_id).expect("Failed to get model dir");

    match file_type {
        "part" => {},
        "image" => {
            final_path.push("images");
        },
        "project" => {
            final_path.push("projects");
        },
        "support" => {
            final_path.push("support");
        },
        _ => {},
    };

    final_path.push(file_name);

    Ok(final_path)
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

    create_dir_all(&path).expect(format!("Failed to create destination directory '{}' for ignored file '{}'", path.to_str().unwrap(), file_name).as_str());

    Ok(())
}
