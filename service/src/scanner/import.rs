use std::path::PathBuf;
use std::fs;
use crate::util::{ensure_tree, get_ignore_dir, get_import_dir, get_library_dir};
use crate::db::model_files::{add_file_to_model, FileCategory};
use crate::db::models::add_model_to_db;
use uuid::{Uuid};
use std::time::{SystemTime, UNIX_EPOCH};

fn ensure_final_dir(path: &PathBuf, model_id: &Uuid, sub_dir: Option<&str>) -> PathBuf {
    let folder_1 = model_id.simple().to_string()[0..2].to_string();
    let folder_2 = model_id.simple().to_string()[2..4].to_string();

    let library_dir = get_library_dir().expect("Failed to get library dir");

    let mut final_path = library_dir.clone();
    final_path.push(folder_1);
    final_path.push(folder_2);
    final_path.push(model_id.hyphenated().to_string());
    if let Some(sub_dir) = sub_dir {
        final_path.push(sub_dir);
    }

    let id_str = model_id.hyphenated().to_string();
    let path_str = path.to_str().unwrap();

    ensure_tree(&final_path).expect(format!("Failed to create destination directory '{}' for new directory '{}'", path_str, id_str).as_str());

    final_path
}

fn ensure_model_dir(path: &PathBuf, model_id: &Uuid) -> PathBuf {
    ensure_final_dir(path, model_id, None)
}

fn ensure_image_dir(path: &PathBuf, model_id: &Uuid) -> PathBuf {
    ensure_final_dir(path, model_id, Option::from("images"))
}

fn ensure_project_dir(path: &PathBuf, model_id: &Uuid) -> PathBuf {
    ensure_final_dir(path, model_id, Option::from("projects"))
}

fn ensure_support_dir(path: &PathBuf, model_id: &Uuid) -> PathBuf {
    ensure_final_dir(path, model_id, Option::from("support"))
}

fn move_file(path: &PathBuf, final_path: &PathBuf) -> Result<(), ()> {
    let mut move_result = fs::rename(path, &final_path);
    let mut retry_count = 0;
    while move_result.is_err() && retry_count < 5 {
        log::warn!("Failed to move {path:?} to {final_path:?}. Retrying in 5 seconds...");
        std::thread::sleep(std::time::Duration::from_secs(5));
        move_result = fs::rename(path, &final_path);
        retry_count += 1;
    }

    if move_result.is_err() {
        log::error!("Failed to move {path:?} to {final_path:?} after 5 retries. Giving up.");
        Err(())
    } else {
        Ok(())
    }
}

fn get_safe_file_name(path: &PathBuf) -> String {
    let base_file_name = path.file_stem().unwrap().to_str().unwrap();

    let start = SystemTime::now();
    let since_the_epoch = start
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards");
    let timestamp = since_the_epoch.as_millis();
    let mut safe_file_name = base_file_name.to_string();
    safe_file_name.push_str("-");
    safe_file_name.push_str( &timestamp.to_string());
    safe_file_name.push_str(".");
    safe_file_name.push_str(path.extension().unwrap().to_str().unwrap());

    safe_file_name
}

pub fn import_single_file(path: &PathBuf, model_id: &Uuid) {
    let file_name = get_safe_file_name(&path);
    let model_name = path.file_stem().unwrap().to_str().unwrap();

    let file_size = path.metadata().unwrap().len();

    let mut final_path = ensure_model_dir(path, model_id);
    final_path.push(&file_name);

    log::info!("Importing file {path:?} to {final_path:?}");

    let move_result = move_file(&path, &final_path);

    if move_result.is_ok() {
        add_model_to_db(&model_name, &model_id);
        add_file_to_model(&file_name, file_size, &model_id, FileCategory::Part);
    }
}

pub fn import_directory(path: &PathBuf, model_id: &Uuid) {
    let final_path = ensure_model_dir(path, model_id);

    log::info!("Importing directory {path:?} to {final_path:?}");

    let model_name = path.file_name().unwrap().to_str().unwrap();
    add_model_to_db(&model_name, &model_id);
    scan_directory_and_import(path, model_id, true);
}

fn scan_directory_and_import(path: &PathBuf, model_id: &Uuid, is_root: bool) {
    let files = fs::read_dir(path).unwrap();
    for file in files {
        let entry = file.unwrap();
        let path = entry.path();

        if path.is_dir() {
            scan_directory_and_import(&path, &model_id, false);
        } else {
            let mut should_move = true;
            let mut file_category = FileCategory::Part;

            match path.extension().unwrap().to_str().unwrap().to_lowercase().as_str() {
                "stl" | "obj" | "gcode" | "3mf" | "scad" => (),
                "txt" | "pdf" | "zip" | "7z" | "html" => {
                    file_category = FileCategory::Support;
                },
                "dxf" | "blend" | "123dx" | "skp" => {
                    file_category = FileCategory::Project;
                },
                "jpg" | "jpeg" | "png" | "webp" | "gif" | "heic" => {
                    file_category = FileCategory::Image;
                },
                _ => {
                    should_move = false;
                },
            }

            if should_move {
                let file_name = get_safe_file_name(&path);
                let file_path: Option<String>;
                match file_category {
                    FileCategory::Image => {
                        file_path = Some(String::from(ensure_image_dir(&path, &model_id).to_str().unwrap()));
                    },
                    FileCategory::Part => {
                        file_path = Some(String::from(ensure_model_dir(&path, &model_id).to_str().unwrap()));
                    },
                    FileCategory::Project => {
                        file_path = Some(String::from(ensure_project_dir(&path, &model_id).to_str().unwrap()));
                    },
                    FileCategory::Support => {
                        file_path = Some(String::from(ensure_support_dir(&path, &model_id).to_str().unwrap()));
                    },
                }

                log::info!("Importing file {file_name:?} to {file_path:?}");

                let file_size = path.metadata().unwrap().len();

                let mut final_path = PathBuf::from(file_path.unwrap());
                final_path.push(&file_name);
                let move_result = move_file(&path, &final_path);

                if move_result.is_ok() {
                    add_file_to_model(&file_name, file_size, &model_id, file_category);
                }
            }
        }
    }

    let remaining_files = fs::read_dir(path).unwrap();
    if remaining_files.count() == 0 {
        fs::remove_dir(path).expect(format!("Failed to remove empty directory '{:?}'", path).as_str());
    } else if is_root {
        ignore_remaining_files(path);
    }
}

fn ignore_remaining_files(path: &PathBuf) {
    let ignore_dir = get_ignore_dir().expect("Failed to get ignore dir");
    let import_dir = get_import_dir().expect("Failed to get import dir");

    let dir_name = path.file_name().unwrap().to_str().unwrap();
    let final_path = PathBuf::from(path.to_str().unwrap().replace(import_dir.to_str().unwrap(), ignore_dir.to_str().unwrap()));

    let mut tree = final_path.clone();
    tree.pop();
    ensure_tree(&tree).expect(format!("Failed to create destination directory '{}' for ignored directory '{}'", final_path.to_str().unwrap(), dir_name).as_str());

    log::info!("Ignoring directory '{dir_name:?}' and moving to '{final_path:?}'");
    fs::rename(&path, &final_path).expect(format!("Failed to move directory '{}' to '{}'", dir_name, final_path.to_str().unwrap()).as_str());
}