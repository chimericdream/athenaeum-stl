use notify::{Config, Event, RecommendedWatcher, RecursiveMode, Watcher};
use std::env;
use std::fs::{create_dir_all, DirBuilder, rename};
use std::io;
use std::path::Path;
use std::path::PathBuf;

fn create_dir(dir: &PathBuf) -> io::Result<()> {
    DirBuilder::new().recursive(true).create(&dir)?;
    Ok(())
}

pub fn init() {
    log::info!("Initializing scanner...");

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
        "stl" => log::info!("Import file: {path:?}"),
        "obj" => log::info!("Import file: {path:?}"),
        _ => ignore_file(path),
    }
}

fn ignore_file(path: &PathBuf) {
    let mut dir = env::current_exe().expect("Failed to get exe dir");
    dir.pop();

    let mut import_dir = dir.clone();
    let mut ignore_dir = dir.clone();
    import_dir.push("import");
    ignore_dir.push("ignored");

    let final_path = PathBuf::from(path.to_str().unwrap().replace(import_dir.to_str().unwrap(), ignore_dir.to_str().unwrap()));
    let file_name = path.file_name().unwrap().to_str().unwrap();
    let mut final_dir = final_path.clone();
    final_dir.pop();

    create_dir_all(&final_dir).expect(format!("Failed to create destination directory '{}' for ignored file '{}'", final_path.to_str().unwrap(), file_name).as_str());

    log::info!("Ignoring file '{file_name:?}' and moving to '{final_path:?}'");
    rename(&path, &final_path).expect(format!("Failed to move file '{}' to '{}'", file_name, final_path.to_str().unwrap()).as_str());
}
