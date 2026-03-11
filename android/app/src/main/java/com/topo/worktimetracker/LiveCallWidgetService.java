package com.topo.worktimetracker;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Locale;

public class LiveCallWidgetService extends Service {
    private static final String CHANNEL_ID = "wtt_live_call_widget_channel";
    private static final int NOTIFICATION_ID = 32018;

    private static final String ACTION_SYNC_SESSION = "com.topo.worktimetracker.widget.SYNC_SESSION";
    private static final String ACTION_STOP_SESSION = "com.topo.worktimetracker.widget.STOP_SESSION";
    private static final String ACTION_START_WIDGET = "com.topo.worktimetracker.widget.START_WIDGET";
    private static final String ACTION_STOP_WIDGET = "com.topo.worktimetracker.widget.STOP_WIDGET";

    private static final String EXTRA_START = "start";
    private static final String EXTRA_RATE_NAME = "rate_name";
    private static final String EXTRA_RATE_AMOUNT = "rate_amount";
    private static final String EXTRA_SOURCE = "source";
    private static final String EXTRA_RECORD_COMPLETED = "record_completed";

    private final Handler handler = new Handler(Looper.getMainLooper());
    private final Runnable tickRunnable = new Runnable() {
        @Override
        public void run() {
            LiveCallWidgetStore.SessionInfo session = LiveCallWidgetStore.getActiveSession(getApplicationContext());
            if (session == null || !session.isValid()) {
                stopForeground(STOP_FOREGROUND_REMOVE);
                stopSelf();
                return;
            }
            startForeground(NOTIFICATION_ID, buildNotification(session));
            LiveCallWidgetProvider.updateAllWidgets(getApplicationContext());
            handler.postDelayed(this, 1000L);
        }
    };

    static void syncFromApp(Context context, long start, String rateName, double rateAmount) {
        Intent intent = new Intent(context, LiveCallWidgetService.class);
        intent.setAction(ACTION_SYNC_SESSION);
        intent.putExtra(EXTRA_START, start);
        intent.putExtra(EXTRA_RATE_NAME, rateName);
        intent.putExtra(EXTRA_RATE_AMOUNT, rateAmount);
        intent.putExtra(EXTRA_SOURCE, "app");
        ContextCompat.startForegroundService(context, intent);
    }

    static void clearFromApp(Context context) {
        Intent intent = new Intent(context, LiveCallWidgetService.class);
        intent.setAction(ACTION_STOP_SESSION);
        intent.putExtra(EXTRA_RECORD_COMPLETED, false);
        context.startService(intent);
    }

    static void startFromWidget(Context context) {
        Intent intent = new Intent(context, LiveCallWidgetService.class);
        intent.setAction(ACTION_START_WIDGET);
        ContextCompat.startForegroundService(context, intent);
    }

    static void stopFromWidget(Context context) {
        Intent intent = new Intent(context, LiveCallWidgetService.class);
        intent.setAction(ACTION_STOP_WIDGET);
        context.startService(intent);
    }

    @Override
    public void onCreate() {
        super.onCreate();
        ensureNotificationChannel();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String action = intent != null ? intent.getAction() : null;

        if (ACTION_SYNC_SESSION.equals(action)) {
            long start = intent.getLongExtra(EXTRA_START, 0L);
            String rateName = intent.getStringExtra(EXTRA_RATE_NAME);
            double rateAmount = intent.getDoubleExtra(EXTRA_RATE_AMOUNT, 0d);
            if (start > 0L && rateAmount > 0d && rateName != null && !rateName.trim().isEmpty()) {
                LiveCallWidgetStore.saveActiveSession(this, start, rateName, rateAmount, intent.getStringExtra(EXTRA_SOURCE));
                startOrRefreshForeground();
            }
            return START_STICKY;
        }

        if (ACTION_START_WIDGET.equals(action)) {
            LiveCallWidgetStore.RateInfo rate = LiveCallWidgetStore.getDefaultRate(this);
            if (rate != null && rate.isValid()) {
                LiveCallWidgetStore.saveActiveSession(this, System.currentTimeMillis(), rate.name, rate.amount, "widget");
                startOrRefreshForeground();
            } else {
                LiveCallWidgetProvider.updateAllWidgets(this);
            }
            return START_STICKY;
        }

        if (ACTION_STOP_WIDGET.equals(action)) {
            stopAndMaybeRecord(true);
            return START_NOT_STICKY;
        }

        if (ACTION_STOP_SESSION.equals(action)) {
            boolean recordCompleted = intent.getBooleanExtra(EXTRA_RECORD_COMPLETED, false);
            stopAndMaybeRecord(recordCompleted);
            return START_NOT_STICKY;
        }

        LiveCallWidgetStore.SessionInfo session = LiveCallWidgetStore.getActiveSession(this);
        if (session != null && session.isValid()) {
            startOrRefreshForeground();
            return START_STICKY;
        }
        return START_NOT_STICKY;
    }

    private void stopAndMaybeRecord(boolean recordCompleted) {
        LiveCallWidgetStore.SessionInfo session = LiveCallWidgetStore.getActiveSession(this);
        if (recordCompleted && session != null && session.isValid()) {
            long endTime = System.currentTimeMillis();
            double earnings = Math.max(0d, ((endTime - session.start) / 60000d) * session.rateAmount);
            JSONObject completed = new JSONObject();
            try {
                completed.put("id", "widget-" + endTime);
                completed.put("startTime", isoTime(session.start));
                completed.put("endTime", isoTime(endTime));
                completed.put("duration", Math.max(0L, endTime - session.start));
                completed.put("rate", session.rateAmount);
                completed.put("rateName", session.rateName);
                completed.put("earnings", Math.round(earnings * 100d) / 100d);
                completed.put("rpgEligible", true);
            } catch (JSONException ignored) {
            }
            LiveCallWidgetStore.appendCompletedCall(this, completed);
        }

        handler.removeCallbacksAndMessages(null);
        LiveCallWidgetStore.clearActiveSession(this);
        stopForeground(STOP_FOREGROUND_REMOVE);
        stopSelf();
        LiveCallWidgetProvider.updateAllWidgets(this);
    }

    private void startOrRefreshForeground() {
        LiveCallWidgetStore.SessionInfo session = LiveCallWidgetStore.getActiveSession(this);
        if (session == null || !session.isValid()) {
            stopAndMaybeRecord(false);
            return;
        }
        startForeground(NOTIFICATION_ID, buildNotification(session));
        handler.removeCallbacks(tickRunnable);
        handler.post(tickRunnable);
        LiveCallWidgetProvider.updateAllWidgets(this);
    }

    private Notification buildNotification(LiveCallWidgetStore.SessionInfo session) {
        long elapsedMs = Math.max(0L, System.currentTimeMillis() - session.start);
        double earnings = Math.max(0d, (elapsedMs / 60000d) * session.rateAmount);
        return new NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Work Time Tracker")
            .setContentText(String.format(Locale.US, "%s - %s", formatElapsed(elapsedMs), formatMoney(earnings)))
            .setSmallIcon(android.R.drawable.ic_media_play)
            .setOngoing(true)
            .setOnlyAlertOnce(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build();
    }

    private void ensureNotificationChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        NotificationManager manager = getSystemService(NotificationManager.class);
        if (manager == null) return;
        NotificationChannel channel = new NotificationChannel(
            CHANNEL_ID,
            "Live Call Widget",
            NotificationManager.IMPORTANCE_LOW
        );
        channel.setDescription("Keeps the live call widget updated while a call is active.");
        manager.createNotificationChannel(channel);
    }

    private static String formatElapsed(long elapsedMs) {
        long totalSeconds = Math.max(0L, elapsedMs / 1000L);
        long hours = totalSeconds / 3600L;
        long minutes = (totalSeconds % 3600L) / 60L;
        long seconds = totalSeconds % 60L;
        return String.format(Locale.US, "%02d:%02d:%02d", hours, minutes, seconds);
    }

    private static String formatMoney(double amount) {
        return String.format(Locale.US, "$%.2f", amount);
    }

    private static String isoTime(long value) {
        return new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX", Locale.US)
            .format(new java.util.Date(value));
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        handler.removeCallbacksAndMessages(null);
        super.onDestroy();
    }
}

