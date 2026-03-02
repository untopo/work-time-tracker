use std::fs;
use std::path::PathBuf;

use rfd::FileDialog;
use serde_json::{Map, Value};
use tauri::{AppHandle, Manager};

fn storage_snapshot_path(app: &AppHandle) -> Result<PathBuf, String> {
  let app_data_dir = app
    .path()
    .app_data_dir()
    .map_err(|error| format!("Failed to resolve app data directory: {error}"))?;

  fs::create_dir_all(&app_data_dir)
    .map_err(|error| format!("Failed to create app data directory: {error}"))?;

  Ok(app_data_dir.join("storage-snapshot.json"))
}

#[tauri::command]
fn load_storage_snapshot(app: AppHandle) -> Result<Map<String, Value>, String> {
  let file_path = storage_snapshot_path(&app)?;
  if !file_path.exists() {
    return Ok(Map::new());
  }

  let raw = fs::read_to_string(&file_path)
    .map_err(|error| format!("Failed to read storage snapshot: {error}"))?;

  if raw.trim().is_empty() {
    return Ok(Map::new());
  }

  serde_json::from_str::<Map<String, Value>>(&raw)
    .map_err(|error| format!("Failed to parse storage snapshot JSON: {error}"))
}

#[tauri::command]
fn save_storage_snapshot(app: AppHandle, snapshot: Map<String, Value>) -> Result<(), String> {
  let file_path = storage_snapshot_path(&app)?;
  let payload = serde_json::to_string_pretty(&snapshot)
    .map_err(|error| format!("Failed to serialize storage snapshot: {error}"))?;

  fs::write(&file_path, payload)
    .map_err(|error| format!("Failed to write storage snapshot: {error}"))
}

#[tauri::command]
fn pick_import_file(file_kind: String) -> Option<String> {
  let dialog = match file_kind.as_str() {
    "csv" => FileDialog::new().add_filter("CSV files", &["csv"]),
    _ => FileDialog::new().add_filter("JSON files", &["json"]),
  };

  dialog
    .pick_file()
    .map(|path| path.to_string_lossy().to_string())
}

#[tauri::command]
fn pick_export_file(default_name: String, file_kind: String) -> Option<String> {
  let dialog = match file_kind.as_str() {
    "csv" => FileDialog::new()
      .add_filter("CSV files", &["csv"])
      .set_file_name(&default_name),
    _ => FileDialog::new()
      .add_filter("JSON files", &["json"])
      .set_file_name(&default_name),
  };

  dialog
    .save_file()
    .map(|path| path.to_string_lossy().to_string())
}

#[tauri::command]
fn read_text_file(path: String) -> Result<String, String> {
  fs::read_to_string(path)
    .map_err(|error| format!("Failed to read file: {error}"))
}

#[tauri::command]
fn write_text_file(path: String, content: String) -> Result<(), String> {
  let path_buf = PathBuf::from(path);
  if let Some(parent_dir) = path_buf.parent() {
    fs::create_dir_all(parent_dir)
      .map_err(|error| format!("Failed to create export directory: {error}"))?;
  }

  fs::write(path_buf, content)
    .map_err(|error| format!("Failed to write file: {error}"))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      load_storage_snapshot,
      save_storage_snapshot,
      pick_import_file,
      pick_export_file,
      read_text_file,
      write_text_file
    ])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
