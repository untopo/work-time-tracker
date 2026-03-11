package com.topo.worktimetracker;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

final class LiveCallWidgetStore {
    static final String PREFS_NAME = "wtt_live_call_widget";
    static final String KEY_DEFAULT_RATE_NAME = "default_rate_name";
    static final String KEY_DEFAULT_RATE_AMOUNT = "default_rate_amount";
    static final String KEY_ACTIVE_START = "active_start";
    static final String KEY_ACTIVE_RATE_NAME = "active_rate_name";
    static final String KEY_ACTIVE_RATE_AMOUNT = "active_rate_amount";
    static final String KEY_ACTIVE_LAST_PING = "active_last_ping";
    static final String KEY_ACTIVE_SOURCE = "active_source";
    static final String KEY_COMPLETED_CALLS = "completed_calls";

    static final class RateInfo {
        final String name;
        final double amount;

        RateInfo(String name, double amount) {
            this.name = name == null ? "" : name;
            this.amount = amount;
        }

        boolean isValid() {
            return !name.trim().isEmpty() && amount > 0;
        }
    }

    static final class SessionInfo {
        final long start;
        final String rateName;
        final double rateAmount;
        final long lastPing;
        final String source;

        SessionInfo(long start, String rateName, double rateAmount, long lastPing, String source) {
            this.start = start;
            this.rateName = rateName == null ? "" : rateName;
            this.rateAmount = rateAmount;
            this.lastPing = lastPing > 0 ? lastPing : start;
            this.source = source == null ? "" : source;
        }

        boolean isValid() {
            return start > 0 && rateAmount > 0 && !rateName.trim().isEmpty();
        }

        JSONObject toJson() {
            JSONObject obj = new JSONObject();
            try {
                obj.put("start", start);
                obj.put("rateName", rateName);
                obj.put("rate", rateAmount);
                obj.put("lastPing", lastPing);
                obj.put("source", source);
            } catch (JSONException ignored) {
            }
            return obj;
        }
    }

    private LiveCallWidgetStore() {}

    private static SharedPreferences prefs(Context context) {
        return context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
    }

    static RateInfo getDefaultRate(Context context) {
        SharedPreferences prefs = prefs(context);
        return new RateInfo(
            prefs.getString(KEY_DEFAULT_RATE_NAME, ""),
            Double.longBitsToDouble(prefs.getLong(KEY_DEFAULT_RATE_AMOUNT, Double.doubleToRawLongBits(0d)))
        );
    }

    static void saveDefaultRate(Context context, String rateName, double rateAmount) {
        prefs(context).edit()
            .putString(KEY_DEFAULT_RATE_NAME, rateName == null ? "" : rateName.trim())
            .putLong(KEY_DEFAULT_RATE_AMOUNT, Double.doubleToRawLongBits(Math.max(0d, rateAmount)))
            .commit();
    }

    static SessionInfo getActiveSession(Context context) {
        SharedPreferences prefs = prefs(context);
        long start = prefs.getLong(KEY_ACTIVE_START, 0L);
        if (start <= 0L) return null;
        SessionInfo session = new SessionInfo(
            start,
            prefs.getString(KEY_ACTIVE_RATE_NAME, ""),
            Double.longBitsToDouble(prefs.getLong(KEY_ACTIVE_RATE_AMOUNT, Double.doubleToRawLongBits(0d))),
            prefs.getLong(KEY_ACTIVE_LAST_PING, start),
            prefs.getString(KEY_ACTIVE_SOURCE, "")
        );
        return session.isValid() ? session : null;
    }

    static void saveActiveSession(Context context, long start, String rateName, double rateAmount, String source) {
        prefs(context).edit()
            .putLong(KEY_ACTIVE_START, start)
            .putString(KEY_ACTIVE_RATE_NAME, rateName == null ? "" : rateName.trim())
            .putLong(KEY_ACTIVE_RATE_AMOUNT, Double.doubleToRawLongBits(Math.max(0d, rateAmount)))
            .putLong(KEY_ACTIVE_LAST_PING, System.currentTimeMillis())
            .putString(KEY_ACTIVE_SOURCE, source == null ? "" : source)
            .commit();
    }

    static void clearActiveSession(Context context) {
        prefs(context).edit()
            .remove(KEY_ACTIVE_START)
            .remove(KEY_ACTIVE_RATE_NAME)
            .remove(KEY_ACTIVE_RATE_AMOUNT)
            .remove(KEY_ACTIVE_LAST_PING)
            .remove(KEY_ACTIVE_SOURCE)
            .commit();
    }

    static JSONArray readCompletedCalls(Context context) {
        String raw = prefs(context).getString(KEY_COMPLETED_CALLS, "[]");
        try {
            return new JSONArray(raw);
        } catch (JSONException ignored) {
            return new JSONArray();
        }
    }

    static void appendCompletedCall(Context context, JSONObject callJson) {
        JSONArray calls = readCompletedCalls(context);
        calls.put(callJson);
        prefs(context).edit().putString(KEY_COMPLETED_CALLS, calls.toString()).commit();
    }

    static JSONArray consumeCompletedCalls(Context context) {
        JSONArray calls = readCompletedCalls(context);
        prefs(context).edit().remove(KEY_COMPLETED_CALLS).commit();
        return calls;
    }
}
