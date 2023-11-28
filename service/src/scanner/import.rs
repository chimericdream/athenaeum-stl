use std::path::PathBuf;
use std::fs;
use crate::util::{ensure_tree, get_library_dir};
use uuid::{Uuid};

pub fn import_single_file(path: &PathBuf, model_id: &Uuid) {
    let file_name = path.file_name().unwrap().to_str().unwrap();

    let folder_1 = model_id.simple().to_string()[0..2].to_string();
    let folder_2 = model_id.simple().to_string()[2..4].to_string();

    let library_dir = get_library_dir().expect("Failed to get library dir");

    let mut final_path = library_dir.clone();
    final_path.push(folder_1);
    final_path.push(folder_2);
    final_path.push(model_id.hyphenated().to_string());
    final_path.push(file_name);

    ensure_tree(&final_path).expect(format!("Failed to create destination directory '{}' for new file '{}'", path.to_str().unwrap(), file_name).as_str());

    log::info!("Importing file {path:?} to {final_path:?}");

    fs::rename(path, final_path).expect("Unable to move file");
}
