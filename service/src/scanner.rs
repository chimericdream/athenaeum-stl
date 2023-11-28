mod import;

use notify::{Config, Event, RecommendedWatcher, RecursiveMode, Watcher};
use std::fs::{DirBuilder, rename};
use std::io;
use std::path::{Path, PathBuf};
use crate::db::model_files::{add_file_to_model, FileCategory};
use crate::db::models::add_model_to_db;
use self::import::import_single_file;
use crate::util::{ensure_tree, get_ignore_dir, get_import_dir, get_library_dir, make_id};

fn create_dir(dir: &PathBuf) -> io::Result<()> {
    DirBuilder::new().recursive(true).create(&dir)?;
    Ok(())
}

pub fn init() {
    log::info!("Initializing scanner...");

    let ignore_dir = get_ignore_dir().expect("Failed to get ignore dir");
    let import_dir = get_import_dir().expect("Failed to get import dir");
    let library_dir = get_library_dir().expect("Failed to get library dir");

    create_dir(&import_dir).expect("Failed to create import directory");
    create_dir(&ignore_dir).expect("Failed to create ignore directory");
    create_dir(&library_dir).expect("Failed to create library directory");

    std::thread::spawn(|| {
        // scan folder for files to import before we start watching
        start_watching(import_dir);
    });
}

fn start_watching(dir: PathBuf) {
    let path = dir.to_str().unwrap();

    log::info!("Watching {path}");

    if let Err(error) = watch(path) {
        log::error!("Error: {error:?}");
    }
}

fn watch<P: AsRef<Path>>(path: P) -> notify::Result<()> {
    let (tx, rx) = std::sync::mpsc::channel();

    // Automatically select the best implementation for your platform.
    // You can also access each implementation directly e.g. INotifyWatcher.
    let mut watcher = RecommendedWatcher::new(tx, Config::default())?;

    // Add a path to be watched. All files and directories at that path and
    // below will be monitored for changes.
    watcher.watch(path.as_ref(), RecursiveMode::NonRecursive)?;

    for res in rx {
        match res {
            Ok(event) => {
                if event.kind.is_create() {
                    check_event(event);
                }
            },
            Err(error) => log::error!("Error: {error:?}"),
        }
    }

    Ok(())
}

fn check_event(event: Event) {
    for path in event.paths {
        if path.is_dir() {
            check_dir_for_import(&path);
        } else {
            check_file_for_import(&path);
        }
    }
}

fn check_dir_for_import(path: &PathBuf) {
    log::info!("Checking directory for import: {path:?}");
}

fn check_file_for_import(path: &PathBuf) {
    match path.extension().unwrap().to_str().unwrap() {
        "stl" | "obj" => import_file(path),
        _ => ignore_file(path),
    }
}

fn import_file(path: &PathBuf) {
    log::info!("Importing file: {path:?}");

    let model_id = make_id();

    let file_name = path.file_name().unwrap().to_str().unwrap();

    import_single_file(path, &model_id);
    add_model_to_db(&file_name, &model_id);
    add_file_to_model(&file_name, &model_id, FileCategory::Part);
}

fn ignore_file(path: &PathBuf) {
    let ignore_dir = get_ignore_dir().expect("Failed to get ignore dir");
    let import_dir = get_import_dir().expect("Failed to get import dir");

    let final_path = PathBuf::from(path.to_str().unwrap().replace(import_dir.to_str().unwrap(), ignore_dir.to_str().unwrap()));
    let file_name = path.file_name().unwrap().to_str().unwrap();
    ensure_tree(&final_path).expect(format!("Failed to create destination directory '{}' for ignored file '{}'", final_path.to_str().unwrap(), file_name).as_str());

    log::info!("Ignoring file '{file_name:?}' and moving to '{final_path:?}'");
    rename(&path, &final_path).expect(format!("Failed to move file '{}' to '{}'", file_name, final_path.to_str().unwrap()).as_str());
}
