use std::fs;
use std::path::PathBuf;

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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      load_storage_snapshot,
      save_storage_snapshot
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
