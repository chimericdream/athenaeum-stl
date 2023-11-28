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
    }

    // let _ = retry(Exponential::from_millis(1000).take(5), || {
    //     fs::rename(path, &final_path).expect("Unable to move file");
    //     Ok::<(), ()>(())
    // });
}
