package com.topo.worktimetracker;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

import org.json.JSONArray;
import org.json.JSONObject;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(LiveCallWidgetPlugin.class);
        registerPlugin(InAppUpdaterPlugin.class);
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onResume() {
        super.onResume();
        dispatchNativeWidgetStateToWebView();
    }

    private void dispatchNativeWidgetStateToWebView() {
        if (bridge == null || bridge.getWebView() == null) return;

        JSONArray completedCalls = LiveCallWidgetStore.readCompletedCalls(this);
        LiveCallWidgetStore.SessionInfo activeSession = LiveCallWidgetStore.getActiveSession(this);
        if (completedCalls.length() == 0 && activeSession == null) return;

        String completedCallsJson = JSONObject.quote(completedCalls.toString());
        String activeSessionJson = JSONObject.quote(activeSession != null ? activeSession.toJson().toString() : "");
        String script =
            "try {" +
                "window.localStorage.setItem('__wtt_native_widget_calls'," + completedCallsJson + ");" +
                "window.localStorage.setItem('__wtt_native_widget_active_session'," + activeSessionJson + ");" +
                "window.dispatchEvent(new CustomEvent('wtt-live-call-widget-sync'));" +
            "} catch (e) {}";

        bridge.getWebView().post(() -> bridge.getWebView().evaluateJavascript(script, null));
    }
}
