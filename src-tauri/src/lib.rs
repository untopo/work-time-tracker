use std::fs;
use std::path::PathBuf;
use std::process::Command;

use rfd::FileDialog;
use serde_json::{Map, Value};
use tauri::{AppHandle, Manager, WindowEvent};
use url::Url;

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

  dialog.pick_file().map(|path| path.to_string_lossy().to_string())
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

  dialog.save_file().map(|path| path.to_string_lossy().to_string())
}

#[tauri::command]
fn read_text_file(path: String) -> Result<String, String> {
  fs::read_to_string(path).map_err(|error| format!("Failed to read file: {error}"))
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

#[tauri::command]
fn open_external_url(url: String) -> Result<(), String> {
  let trimmed = url.trim();
  if trimmed.is_empty() {
    return Err("URL cannot be empty".to_string());
  }

  if trimmed.len() > 2048 {
    return Err("URL is too long".to_string());
  }

  let parsed = Url::parse(trimmed).map_err(|_| "Invalid URL format".to_string())?;
  if parsed.scheme() != "http" && parsed.scheme() != "https" {
    return Err("Only http/https URLs are allowed".to_string());
  }
  if parsed.host_str().is_none() {
    return Err("URL host is required".to_string());
  }
  if !parsed.username().is_empty() || parsed.password().is_some() {
    return Err("URL with credentials is not allowed".to_string());
  }

  let safe_url = parsed.as_str();

  #[cfg(target_os = "windows")]
  {
    Command::new("explorer")
      .arg(safe_url)
      .spawn()
      .map_err(|error| format!("Failed to open external URL: {error}"))?;
    return Ok(());
  }

  #[cfg(target_os = "macos")]
  {
    Command::new("open")
      .arg(safe_url)
      .spawn()
      .map_err(|error| format!("Failed to open external URL: {error}"))?;
    return Ok(());
  }

  #[cfg(all(unix, not(target_os = "macos")))]
  {
    Command::new("xdg-open")
      .arg(safe_url)
      .spawn()
      .map_err(|error| format!("Failed to open external URL: {error}"))?;
    return Ok(());
  }
}

fn is_allowed_release_asset_url(parsed: &Url) -> bool {
  if parsed.scheme() != "https" {
    return false;
  }
  if parsed.host_str() != Some("github.com") {
    return false;
  }
  let path = parsed.path();
  if !path.starts_with("/untopo/work-time-tracker/releases/download/") {
    return false;
  }
  let lower = path.to_ascii_lowercase();
  lower.ends_with(".exe") || lower.ends_with(".msi")
}

fn sanitize_file_name(input: &str) -> String {
  input
    .chars()
    .filter(|ch| ch.is_ascii_alphanumeric() || *ch == '.' || *ch == '-' || *ch == '_')
    .collect::<String>()
}

#[tauri::command]
fn download_and_launch_windows_installer(url: String, file_name: Option<String>) -> Result<(), String> {
  let trimmed = url.trim();
  if trimmed.is_empty() {
    return Err("URL cannot be empty".to_string());
  }

  let parsed = Url::parse(trimmed).map_err(|_| "Invalid URL format".to_string())?;
  if !is_allowed_release_asset_url(&parsed) {
    return Err("Only official GitHub release installer assets are allowed".to_string());
  }

  #[cfg(not(target_os = "windows"))]
  {
    let _ = file_name;
    return Err("In-app installer flow is currently available only on Windows desktop builds".to_string());
  }

  #[cfg(target_os = "windows")]
  {
    let fallback_name = parsed
      .path_segments()
      .and_then(|mut segments| segments.next_back())
      .unwrap_or("work-time-tracker-update.exe");
    let requested_name = file_name.unwrap_or_else(|| fallback_name.to_string());
    let safe_name = {
      let sanitized = sanitize_file_name(&requested_name);
      if sanitized.is_empty() {
        sanitize_file_name(fallback_name)
      } else {
        sanitized
      }
    };

    let temp_path = std::env::temp_dir().join(format!("wtt-{safe_name}"));
    let temp_path_str = temp_path.to_string_lossy().to_string();
    let escaped_url = trimmed.replace('\'', "''");
    let escaped_out_path = temp_path_str.replace('\'', "''");

    let ps_script = format!(
      "$ProgressPreference='SilentlyContinue';Invoke-WebRequest -Uri '{escaped_url}' -OutFile '{escaped_out_path}'"
    );
    let download_status = Command::new("powershell")
      .args(["-NoProfile", "-NonInteractive", "-Command", &ps_script])
      .status()
      .map_err(|error| format!("Failed to start download process: {error}"))?;

    if !download_status.success() {
      return Err("Failed to download installer package".to_string());
    }

    let lower_name = safe_name.to_ascii_lowercase();
    if lower_name.ends_with(".msi") {
      Command::new("msiexec")
        .args(["/i", &temp_path_str])
        .spawn()
        .map_err(|error| format!("Failed to launch MSI installer: {error}"))?;
    } else {
      Command::new(&temp_path)
        .spawn()
        .map_err(|error| format!("Failed to launch installer: {error}"))?;
    }

    Ok(())
  }
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
      show_main_window,
      open_external_url,
      download_and_launch_windows_installer
    ])
    .setup(|app| {
      if let Some(main_window) = app.handle().get_webview_window("main") {
        let app_handle = app.handle().clone();
        main_window.on_window_event(move |event| {
          if let WindowEvent::CloseRequested { api, .. } = event {
            api.prevent_close();
            app_handle.exit(0);
          }
        });
      }
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
