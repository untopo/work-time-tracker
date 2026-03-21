package com.topo.worktimetracker;

import android.content.Intent;
import android.net.Uri;

import androidx.core.content.FileProvider;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@CapacitorPlugin(name = "InAppUpdater")
public class InAppUpdaterPlugin extends Plugin {
    private static final String ALLOWED_PREFIX = "https://github.com/untopo/work-time-tracker/releases/download/";
    private final ExecutorService executor = Executors.newSingleThreadExecutor();

    @PluginMethod
    public void downloadAndInstallApk(PluginCall call) {
        String url = call.getString("url", "").trim();
        String preferredName = call.getString("fileName", "app-update.apk");

        if (!url.startsWith(ALLOWED_PREFIX) || !url.toLowerCase().endsWith(".apk")) {
            call.reject("Only official GitHub APK release assets are allowed.");
            return;
        }

        final String safeFileName = sanitizeApkName(preferredName);

        executor.execute(() -> {
            HttpURLConnection connection = null;
            InputStream inputStream = null;
            FileOutputStream outputStream = null;

            try {
                URL remote = new URL(url);
                connection = (HttpURLConnection) remote.openConnection();
                connection.setConnectTimeout(15000);
                connection.setReadTimeout(120000);
                connection.setInstanceFollowRedirects(true);
                connection.connect();

                int statusCode = connection.getResponseCode();
                if (statusCode < 200 || statusCode >= 300) {
                    call.reject("Failed to download APK. HTTP " + statusCode);
                    return;
                }

                File updatesDir = new File(getContext().getExternalCacheDir(), "updates");
                if (!updatesDir.exists() && !updatesDir.mkdirs()) {
                    call.reject("Could not prepare update cache directory.");
                    return;
                }

                File apkFile = new File(updatesDir, safeFileName);
                inputStream = connection.getInputStream();
                outputStream = new FileOutputStream(apkFile, false);

                byte[] buffer = new byte[8192];
                int read;
                while ((read = inputStream.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, read);
                }
                outputStream.flush();

                Uri apkUri = FileProvider.getUriForFile(
                    getContext(),
                    getContext().getPackageName() + ".fileprovider",
                    apkFile
                );

                Intent intent = new Intent(Intent.ACTION_VIEW);
                intent.setDataAndType(apkUri, "application/vnd.android.package-archive");
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

                getActivity().runOnUiThread(() -> {
                    try {
                        getContext().startActivity(intent);
                        JSObject result = new JSObject();
                        result.put("ok", true);
                        result.put("path", apkFile.getAbsolutePath());
                        call.resolve(result);
                    } catch (Exception launchError) {
                        call.reject("APK downloaded but installer launch failed: " + launchError.getMessage());
                    }
                });
            } catch (Exception error) {
                call.reject("In-app APK update failed: " + error.getMessage());
            } finally {
                try {
                    if (outputStream != null) outputStream.close();
                } catch (Exception ignored) {}
                try {
                    if (inputStream != null) inputStream.close();
                } catch (Exception ignored) {}
                if (connection != null) connection.disconnect();
            }
        });
    }

    private String sanitizeApkName(String fileName) {
        String value = (fileName == null ? "" : fileName).trim();
        if (value.isEmpty()) value = "app-update.apk";
        value = value.replaceAll("[^A-Za-z0-9._-]", "_");
        if (!value.toLowerCase().endsWith(".apk")) {
            value = value + ".apk";
        }
        return value;
    }
}
