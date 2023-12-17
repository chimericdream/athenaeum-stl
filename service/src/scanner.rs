mod import;

use notify::{Config, Event, RecommendedWatcher, RecursiveMode, Watcher};
use std::fs::{DirBuilder, rename};
use std::{fs, io};
use std::path::{Path, PathBuf};
use self::import::{import_directory, import_single_file};
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

    log::info!("Checking import directory for files to import...");
    let files = fs::read_dir(&import_dir).unwrap();
    for entry in files {
        let file = entry.unwrap();
        let path = file.path();

        if path.is_dir() {
            check_dir_for_import(&path);
        } else {
            check_file_for_import(&path);
        }
    }

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

fn watch<P: AsRef<Path>>(import_path: P) -> notify::Result<()> {
    let (tx, rx) = std::sync::mpsc::channel();

    // Automatically select the best implementation for your platform.
    // You can also access each implementation directly e.g. INotifyWatcher.
    let mut watcher = RecommendedWatcher::new(tx, Config::default())?;

    // Add a path to be watched. All files and directories at that path and
    // below will be monitored for changes.
    watcher.watch(import_path.as_ref(), RecursiveMode::NonRecursive)?;

    for res in rx {
        match res {
            Ok(event) => {
                if event.kind.is_create() {
                    // Wait a couple of seconds before we try to import, in case the file/directory is still being written
                    std::thread::sleep(std::time::Duration::from_secs(2));
                    check_event(event, &import_path.as_ref());
                }
            },
            Err(error) => log::error!("Error: {error:?}"),
        }
    }

    Ok(())
}

fn check_event(event: Event, import_path: &Path) {
    for path in event.paths {
        if path.is_dir() {
            if path.ne(import_path) {
                check_dir_for_import(&path);
            }
        } else {
            check_file_for_import(&path);
        }
    }
}

fn check_dir_for_import(path: &PathBuf) {
    /*
    Check root of directory for one or more stl/obj files
        If none found, ignore directory
        If some found, import all files in directory
     */
    log::info!("Checking directory for import: {path:?}");

    let mut has_importable_files = false;
    let files = fs::read_dir(path).unwrap();
    for file in files {
        let entry = file.unwrap();
        let path = entry.path();

        if !path.is_dir() {
            match path.extension().unwrap().to_str().unwrap().to_lowercase().as_str() {
                "stl" | "obj" | "gcode" | "3mf" | "scad" => has_importable_files = true,
                _ => (),
            }
        }
    }

    if has_importable_files {
        import_dir(path);
    } else {
        ignore_dir(path);
    }
}

fn import_dir(path: &PathBuf) {
    log::info!("Importing directory: {path:?}");

    import_directory(path, &make_id());
}

fn ignore_dir(path: &PathBuf) {
    let ignore_dir = get_ignore_dir().expect("Failed to get ignore dir");
    let import_dir = get_import_dir().expect("Failed to get import dir");

    let dir_name = path.file_name().unwrap().to_str().unwrap();
    let final_path = PathBuf::from(path.to_str().unwrap().replace(import_dir.to_str().unwrap(), ignore_dir.to_str().unwrap()));

    let mut tree = final_path.clone();
    tree.pop();
    ensure_tree(&tree).expect(format!("Failed to create destination directory '{}' for ignored directory '{}'", final_path.to_str().unwrap(), dir_name).as_str());

    log::info!("Ignoring directory '{dir_name:?}' and moving to '{final_path:?}'");
    rename(&path, &final_path).expect(format!("Failed to move directory '{}' to '{}'", dir_name, final_path.to_str().unwrap()).as_str());
}

fn check_file_for_import(path: &PathBuf) {
    match path.extension().unwrap().to_str().unwrap().to_lowercase().as_str() {
        "stl" | "obj" | "gcode" | "3mf" | "scad" => import_file(path),
        _ => ignore_file(path),
    }
}

fn import_file(path: &PathBuf) {
    log::info!("Importing file: {path:?}");

    let model_id = make_id();

    import_single_file(path, &model_id);
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
