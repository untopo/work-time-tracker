package com.topo.worktimetracker;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;

public class LiveCallWidgetProvider extends AppWidgetProvider {
    public static final String ACTION_START = "com.topo.worktimetracker.widget.START";
    public static final String ACTION_STOP = "com.topo.worktimetracker.widget.STOP";
    public static final String ACTION_REFRESH = "com.topo.worktimetracker.widget.REFRESH";

    static void updateAllWidgets(Context context) {
        LiveCallWidgetUi.updateAllWidgets(context);
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        LiveCallWidgetUi.updateProviderWidgets(context, LiveCallWidgetProvider.class);
    }

    @Override
    public void onAppWidgetOptionsChanged(Context context, AppWidgetManager appWidgetManager, int appWidgetId, android.os.Bundle newOptions) {
        super.onAppWidgetOptionsChanged(context, appWidgetManager, appWidgetId, newOptions);
        LiveCallWidgetUi.updateProviderWidgets(context, LiveCallWidgetProvider.class);
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
        LiveCallWidgetUi.handleWidgetBroadcast(context, intent);
    }

    @Override
    public void onDisabled(Context context) {
        super.onDisabled(context);
        LiveCallWidgetService.clearFromApp(context);
    }
}
