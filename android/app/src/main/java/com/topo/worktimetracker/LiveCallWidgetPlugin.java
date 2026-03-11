package com.topo.worktimetracker;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONArray;

@CapacitorPlugin(name = "LiveCallWidget")
public class LiveCallWidgetPlugin extends Plugin {
    @PluginMethod
    public void setDefaultRate(PluginCall call) {
        String rateName = call.getString("rateName", "");
        Double rateAmount = call.getDouble("rateAmount");
        double normalizedRateAmount = rateAmount != null ? Math.max(0d, rateAmount) : 0d;

        LiveCallWidgetStore.saveDefaultRate(getContext(), rateName, normalizedRateAmount);

        JSObject result = new JSObject();
        result.put("ok", true);
        call.resolve(result);
    }

    @PluginMethod
    public void syncActiveSession(PluginCall call) {
        boolean active = call.getBoolean("active", false);
        if (!active) {
            LiveCallWidgetService.clearFromApp(getContext());
            JSObject result = new JSObject();
            result.put("ok", true);
            call.resolve(result);
            return;
        }

        Long start = call.getLong("start");
        String rateName = call.getString("rateName", "");
        Double rateAmount = call.getDouble("rateAmount");
        double normalizedRateAmount = rateAmount != null ? Math.max(0d, rateAmount) : 0d;

        if (start == null || start <= 0L || normalizedRateAmount <= 0d || rateName.trim().isEmpty()) {
            call.reject("A valid active session is required to sync the widget.");
            return;
        }

        LiveCallWidgetStore.saveDefaultRate(getContext(), rateName, normalizedRateAmount);
        LiveCallWidgetService.syncFromApp(getContext(), start, rateName, normalizedRateAmount);

        JSObject result = new JSObject();
        result.put("ok", true);
        call.resolve(result);
    }

    @PluginMethod
    public void getWidgetState(PluginCall call) {
        LiveCallWidgetStore.RateInfo defaultRate = LiveCallWidgetStore.getDefaultRate(getContext());
        LiveCallWidgetStore.SessionInfo activeSession = LiveCallWidgetStore.getActiveSession(getContext());

        JSObject result = new JSObject();
        result.put("defaultRateName", defaultRate != null ? defaultRate.name : "");
        result.put("defaultRateAmount", defaultRate != null ? defaultRate.amount : 0d);
        result.put("activeSessionJson", activeSession != null ? activeSession.toJson().toString() : "");
        call.resolve(result);
    }

    @PluginMethod
    public void consumeCompletedCalls(PluginCall call) {
        JSONArray completedCalls = LiveCallWidgetStore.consumeCompletedCalls(getContext());
        JSObject result = new JSObject();
        result.put("callsJson", completedCalls.toString());
        call.resolve(result);
    }
}
