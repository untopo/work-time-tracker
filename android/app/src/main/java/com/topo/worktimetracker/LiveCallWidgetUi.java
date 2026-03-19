package com.topo.worktimetracker;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.view.View;
import android.widget.RemoteViews;

import java.util.Locale;

final class LiveCallWidgetUi {
    private static final String EXTRA_WIDGET_TOKEN = "com.topo.worktimetracker.widget.EXTRA_TOKEN";

    private LiveCallWidgetUi() {}

    static void updateAllWidgets(Context context) {
        updateProviderWidgets(context, LiveCallWidgetProvider.class);
    }

    static void updateProviderWidgets(Context context, Class<? extends AppWidgetProvider> providerClass) {
        AppWidgetManager manager = AppWidgetManager.getInstance(context);
        ComponentName provider = new ComponentName(context, providerClass);
        int[] ids = manager.getAppWidgetIds(provider);
        if (ids == null || ids.length == 0) return;
        for (int appWidgetId : ids) {
            Bundle options = manager.getAppWidgetOptions(appWidgetId);
            int resolvedLayoutResId = resolveLayoutForOptions(options);
            manager.updateAppWidget(appWidgetId, buildRemoteViews(context, resolvedLayoutResId, providerClass));
        }
    }

    static void handleWidgetBroadcast(Context context, Intent intent) {
        String action = intent != null ? intent.getAction() : null;
        if (LiveCallWidgetProvider.ACTION_START.equals(action)
            || LiveCallWidgetProvider.ACTION_STOP.equals(action)
            || LiveCallWidgetProvider.ACTION_REFRESH.equals(action)) {
            if (!hasTrustedWidgetToken(context, intent)) return;
        }
        if (LiveCallWidgetProvider.ACTION_START.equals(action)) {
            LiveCallWidgetService.startFromWidget(context);
            return;
        }
        if (LiveCallWidgetProvider.ACTION_STOP.equals(action)) {
            LiveCallWidgetService.stopFromWidget(context);
            return;
        }
        if (LiveCallWidgetProvider.ACTION_REFRESH.equals(action)) {
            updateAllWidgets(context);
        }
    }

    private static RemoteViews buildRemoteViews(Context context, int layoutResId, Class<? extends AppWidgetProvider> providerClass) {
        RemoteViews views = new RemoteViews(context.getPackageName(), layoutResId);
        LiveCallWidgetStore.SessionInfo session = LiveCallWidgetStore.getActiveSession(context);
        LiveCallWidgetStore.RateInfo defaultRate = LiveCallWidgetStore.getDefaultRate(context);
        boolean isActive = session != null && session.isValid();
        boolean hasRate = defaultRate != null && defaultRate.isValid();

        views.setViewVisibility(R.id.widget_active_card, isActive ? View.VISIBLE : View.GONE);

        if (isActive) {
            long elapsedMs = Math.max(0L, System.currentTimeMillis() - session.start);
            double earnings = (elapsedMs / 60000d) * session.rateAmount;
            views.setViewVisibility(R.id.widget_timer, View.VISIBLE);
            views.setViewVisibility(R.id.widget_earnings, View.VISIBLE);
            views.setTextViewText(R.id.widget_timer, formatElapsed(elapsedMs));
            views.setTextViewText(R.id.widget_earnings, formatMoney(earnings));
            views.setViewVisibility(R.id.widget_start_btn, View.GONE);
            views.setViewVisibility(R.id.widget_stop_btn, View.VISIBLE);
        } else {
            views.setTextViewText(R.id.widget_timer, "00:00:00");
            views.setTextViewText(R.id.widget_earnings, "$0.00");
            views.setViewVisibility(R.id.widget_timer, View.GONE);
            views.setViewVisibility(R.id.widget_earnings, View.GONE);
            views.setViewVisibility(R.id.widget_stop_btn, View.GONE);
            views.setViewVisibility(R.id.widget_start_btn, View.VISIBLE);
            views.setBoolean(R.id.widget_start_btn, "setEnabled", hasRate);
            views.setFloat(R.id.widget_start_btn, "setAlpha", hasRate ? 1f : 0.55f);
        }

        views.setOnClickPendingIntent(
            R.id.widget_start_btn,
            buildBroadcastIntent(context, providerClass, LiveCallWidgetProvider.ACTION_START, providerClass.hashCode() + 11)
        );
        views.setOnClickPendingIntent(
            R.id.widget_stop_btn,
            buildBroadcastIntent(context, providerClass, LiveCallWidgetProvider.ACTION_STOP, providerClass.hashCode() + 12)
        );
        PendingIntent launchIntent = buildLaunchAppIntent(context, providerClass.hashCode() + 13);
        if (launchIntent != null) {
            views.setOnClickPendingIntent(R.id.widget_open_btn, launchIntent);
        }
        return views;
    }

    private static PendingIntent buildBroadcastIntent(
        Context context,
        Class<? extends AppWidgetProvider> providerClass,
        String action,
        int requestCode
    ) {
        Intent intent = new Intent(context, providerClass);
        intent.setAction(action);
        intent.setPackage(context.getPackageName());
        intent.putExtra(EXTRA_WIDGET_TOKEN, LiveCallWidgetStore.getOrCreateBroadcastToken(context));
        return PendingIntent.getBroadcast(
            context,
            requestCode,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
    }

    private static boolean hasTrustedWidgetToken(Context context, Intent intent) {
        if (intent == null) return false;
        String provided = intent.getStringExtra(EXTRA_WIDGET_TOKEN);
        if (provided == null || provided.trim().isEmpty()) return false;
        String expected = LiveCallWidgetStore.getOrCreateBroadcastToken(context);
        return provided.equals(expected);
    }

    private static PendingIntent buildLaunchAppIntent(Context context, int requestCode) {
        PackageManager packageManager = context.getPackageManager();
        Intent launchIntent = packageManager.getLaunchIntentForPackage(context.getPackageName());
        if (launchIntent == null) return null;
        launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        return PendingIntent.getActivity(
            context,
            requestCode,
            launchIntent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
    }

    private static String formatElapsed(long elapsedMs) {
        long totalSeconds = Math.max(0L, elapsedMs / 1000L);
        long hours = totalSeconds / 3600L;
        long minutes = (totalSeconds % 3600L) / 60L;
        long seconds = totalSeconds % 60L;
        return String.format(Locale.US, "%02d:%02d:%02d", hours, minutes, seconds);
    }

    private static String formatMoney(double amount) {
        return String.format(Locale.US, "$%.2f", Math.max(0d, amount));
    }

    private static int resolveLayoutForOptions(Bundle options) {
        if (options == null) return R.layout.live_call_widget_wide;
        int minWidth = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 0);
        int minHeight = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT, 0);
        if (minWidth < 150 || minHeight < 90) return R.layout.live_call_widget_compact;
        if (minWidth < 210 || minHeight < 140) return R.layout.live_call_widget_square;
        return R.layout.live_call_widget_wide;
    }
}
