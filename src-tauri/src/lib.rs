use std::fs;
use std::path::PathBuf;

use rfd::FileDialog;
use serde_json::{Map, Value};
use tauri::{AppHandle, Emitter, Manager, PhysicalPosition, Position, WebviewUrl, WebviewWindowBuilder};

const DESKTOP_OVERLAY_LABEL: &str = "desktop-overlay";

fn storage_snapshot_path(app: &AppHandle) -> Result<PathBuf, String> {
  let app_data_dir = app
    .path()
    .app_data_dir()
    .map_err(|error| format!("Failed to resolve app data directory: {error}"))?;

  fs::create_dir_all(&app_data_dir)
    .map_err(|error| format!("Failed to create app data directory: {error}"))?;

  Ok(app_data_dir.join("storage-snapshot.json"))
}

fn ensure_desktop_overlay_window(app: &AppHandle) -> Result<(), String> {
  if app.get_webview_window(DESKTOP_OVERLAY_LABEL).is_some() {
    return Ok(());
  }

  WebviewWindowBuilder::new(app, DESKTOP_OVERLAY_LABEL, WebviewUrl::App("overlay.html".into()))
    .title("Work Time Tracker Overlay")
    .inner_size(210.0, 208.0)
    .resizable(false)
    .visible(false)
    .decorations(false)
    .always_on_top(true)
    .skip_taskbar(true)
    .shadow(true)
    .build()
    .map_err(|error| format!("Failed to create desktop overlay window: {error}"))?;

  let _ = dock_desktop_overlay_window(app);

  Ok(())
}

fn dock_desktop_overlay_window(app: &AppHandle) -> Result<(), String> {
  let overlay = app
    .get_webview_window(DESKTOP_OVERLAY_LABEL)
    .ok_or_else(|| "Desktop overlay window is not available".to_string())?;

  let monitor = overlay
    .current_monitor()
    .map_err(|error| format!("Failed to resolve overlay monitor: {error}"))?
    .or_else(|| {
      app
        .get_webview_window("main")
        .and_then(|main| main.current_monitor().ok().flatten())
    })
    .ok_or_else(|| "No monitor available for desktop overlay".to_string())?;

  let monitor_size = monitor.size();
  let monitor_origin = monitor.position();
  let overlay_size = overlay
    .outer_size()
    .map_err(|error| format!("Failed to read overlay size: {error}"))?;
  let padding = 20i32;
  let x = monitor_origin.x + monitor_size.width as i32 - overlay_size.width as i32 - padding;
  let y = monitor_origin.y + monitor_size.height as i32 - overlay_size.height as i32 - padding;

  overlay
    .set_position(Position::Physical(PhysicalPosition::new(x, y)))
    .map_err(|error| format!("Failed to position desktop overlay: {error}"))?;

  Ok(())
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

#[tauri::command]
fn set_desktop_overlay_visible(app: AppHandle, visible: bool) -> Result<(), String> {
  ensure_desktop_overlay_window(&app)?;
  let overlay = app
    .get_webview_window(DESKTOP_OVERLAY_LABEL)
    .ok_or_else(|| "Desktop overlay window is not available".to_string())?;

  if visible {
    overlay
      .show()
      .map_err(|error| format!("Failed to show desktop overlay: {error}"))?;
  } else {
    overlay
      .hide()
      .map_err(|error| format!("Failed to hide desktop overlay: {error}"))?;
  }

  Ok(())
}

#[tauri::command]
fn update_desktop_overlay(app: AppHandle, payload: Value) -> Result<(), String> {
  ensure_desktop_overlay_window(&app)?;
  app
    .emit_to(DESKTOP_OVERLAY_LABEL, "desktop-overlay-state", payload)
    .map_err(|error| format!("Failed to emit desktop overlay state: {error}"))
}

#[tauri::command]
fn show_main_window(app: AppHandle) -> Result<(), String> {
  let main_window = app
    .get_webview_window("main")
    .ok_or_else(|| "Main window is not available".to_string())?;

  if let Ok(true) = main_window.is_minimized() {
    let _ = main_window.unminimize();
  }

  main_window
    .show()
    .map_err(|error| format!("Failed to show main window: {error}"))?;
  main_window
    .set_focus()
    .map_err(|error| format!("Failed to focus main window: {error}"))
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
      write_text_file,
      set_desktop_overlay_visible,
      update_desktop_overlay,
      show_main_window
    ])
    .setup(|app| {
      let _ = ensure_desktop_overlay_window(&app.handle());
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
