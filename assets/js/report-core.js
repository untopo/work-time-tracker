/* Monthly report and share card.
 *
 * Plain script (no modules), loaded after data-core.js and before app.js.
 * Everything here is read-only: it takes copies of the saved calls, sessions,
 * payment cycles and goal, and returns numbers, HTML text or a picture. It never
 * writes to storage and never sends anything anywhere.
 * Uses globals from data-core.js: getCallStartMs, getCallDurationSeconds,
 * getCallEarnings, getDayStartMs, getLocalDateKey, escapeHTML.
 */

const REPORT_MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const REPORT_MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const REPORT_WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const REPORT_DAY_MS = 24 * 60 * 60 * 1000;
const REPORT_HOUR_MS = 60 * 60 * 1000;

function reportMonthRange(year, month) {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 1);
    return {
        year: start.getFullYear(),
        month: start.getMonth(),
        startMs: start.getTime(),
        endMs: end.getTime(),
        daysInMonth: new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate(),
        label: `${REPORT_MONTH_NAMES[start.getMonth()]} ${start.getFullYear()}`,
        short: REPORT_MONTH_SHORT[start.getMonth()]
    };
}

function reportFormatMoney(value) {
    const n = Number(value) || 0;
    return `$${n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

function reportFormatHoursMinutes(ms) {
    const totalMinutes = Math.floor(Math.max(0, Number(ms) || 0) / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${String(minutes).padStart(2, '0')}m`;
}

function reportFormatMinutesSeconds(ms) {
    const totalSeconds = Math.round(Math.max(0, Number(ms) || 0) / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
}

function reportFormatHour(hour) {
    const h = ((hour % 24) + 24) % 24;
    const suffix = h < 12 ? 'AM' : 'PM';
    const twelve = h % 12 === 0 ? 12 : h % 12;
    return `${twelve} ${suffix}`;
}

function reportFormatNumber(value) {
    return String(Math.round(Number(value) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function reportMondayIndex(date) {
    return (date.getDay() + 6) % 7;
}

// Weeks start on Monday and are cut at the first and last day of the month.
function reportBuildWeeks(range) {
    const weeks = [];
    const dayToWeek = [];
    let day = 1;
    while (day <= range.daysInMonth) {
        const date = new Date(range.year, range.month, day);
        const lastDay = Math.min(range.daysInMonth, day + (6 - reportMondayIndex(date)));
        const index = weeks.length;
        weeks.push({
            startDay: day,
            endDay: lastDay,
            label: day === lastDay ? `${range.short} ${day}` : `${range.short} ${day}-${lastDay}`,
            earnings: 0,
            calls: 0,
            talkMs: 0
        });
        for (let d = day; d <= lastDay; d += 1) dayToWeek[d] = index;
        day = lastDay + 1;
    }
    return { weeks, dayToWeek };
}

function reportNormalizeCalls(calls) {
    const out = [];
    (Array.isArray(calls) ? calls : []).forEach((call) => {
        if (!call || typeof call !== 'object') return;
        const startMs = getCallStartMs(call);
        if (!Number.isFinite(startMs)) return;
        const durationMs = Math.max(0, getCallDurationSeconds(call) * 1000);
        const earnings = Math.max(0, Number(getCallEarnings(call)) || 0);
        out.push({
            startMs,
            durationMs,
            earnings,
            rate: Number(call.rate) || 0,
            rateName: String(call.rateName || '').trim()
        });
    });
    return out;
}

function reportAddToHeat(heat, startMs, durationMs) {
    // Split a call across the hours it spans, so a call from 9:50 to 10:20 counts in both hours.
    let cursor = startMs;
    const endMs = startMs + durationMs;
    let guard = 0;
    while (cursor < endMs && guard < 60) {
        const date = new Date(cursor);
        const hourEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() + 1).getTime();
        const sliceEnd = Math.min(endMs, hourEnd > cursor ? hourEnd : cursor + REPORT_HOUR_MS);
        heat[reportMondayIndex(date)][date.getHours()] += (sliceEnd - cursor) / 60000;
        cursor = sliceEnd;
        guard += 1;
    }
}

function reportCycleRange(cycle) {
    const start = new Date(cycle && cycle.startDate);
    const end = new Date(cycle && cycle.endDate);
    if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime())) return null;
    const startMs = getDayStartMs(start);
    const endMs = getDayStartMs(end) + REPORT_DAY_MS; // the last day belongs to the cycle
    if (endMs <= startMs) return null;
    return { startMs, endMs };
}

function reportShortDate(ms) {
    const d = new Date(ms);
    return `${REPORT_MONTH_SHORT[d.getMonth()]} ${d.getDate()}`;
}

function buildMonthlyReport(input) {
    const data = input && typeof input === 'object' ? input : {};
    const range = reportMonthRange(Number(data.year), Number(data.month));
    const allCalls = reportNormalizeCalls(data.calls);
    const monthCalls = allCalls.filter((c) => c.startMs >= range.startMs && c.startMs < range.endMs);
    const { weeks, dayToWeek } = reportBuildWeeks(range);

    const totals = { earnings: 0, calls: monthCalls.length, talkMs: 0, avgCallMs: 0 };
    const days = new Map();
    const rateMap = new Map();
    const heat = REPORT_WEEKDAYS.map(() => new Array(24).fill(0));

    monthCalls.forEach((call) => {
        totals.earnings += call.earnings;
        totals.talkMs += call.durationMs;

        const dayKey = getLocalDateKey(new Date(call.startMs));
        const day = days.get(dayKey) || { dayKey, startMs: getDayStartMs(new Date(call.startMs)), earnings: 0, talkMs: 0, calls: 0 };
        day.earnings += call.earnings;
        day.talkMs += call.durationMs;
        day.calls += 1;
        days.set(dayKey, day);

        const week = weeks[dayToWeek[new Date(call.startMs).getDate()]];
        if (week) {
            week.earnings += call.earnings;
            week.calls += 1;
            week.talkMs += call.durationMs;
        }

        const rateKey = `${call.rateName.toLowerCase()}|${call.rate.toFixed(6)}`;
        const entry = rateMap.get(rateKey) || { name: call.rateName || 'Unnamed rate', rate: call.rate, calls: 0, minutes: 0, earned: 0 };
        entry.calls += 1;
        entry.minutes += call.durationMs / 60000;
        entry.earned += call.earnings;
        rateMap.set(rateKey, entry);

        reportAddToHeat(heat, call.startMs, call.durationMs);
    });
    totals.avgCallMs = totals.calls ? totals.talkMs / totals.calls : 0;

    const byRate = Array.from(rateMap.values()).sort((a, b) => b.earned - a.earned);
    const dayList = Array.from(days.values()).sort((a, b) => a.startMs - b.startMs);

    // Daily goal: reached when every target set is met (amount, or minutes when only minutes are set).
    const goalInput = data.dailyGoal && typeof data.dailyGoal === 'object' ? data.dailyGoal : {};
    const goalAmount = Math.max(0, Number(goalInput.amount) || 0);
    const goalMinutes = Math.max(0, Number(goalInput.minutes) || 0);
    let goal = null;
    if (goalAmount > 0 || goalMinutes > 0) {
        const type = goalAmount > 0 ? 'amount' : 'minutes';
        const reached = dayList.filter((day) => (type === 'amount' ? day.earnings >= goalAmount : day.talkMs >= goalMinutes * 60000)).length;
        goal = {
            type,
            target: type === 'amount' ? goalAmount : goalMinutes,
            targetLabel: type === 'amount' ? reportFormatMoney(goalAmount) : reportFormatHoursMinutes(goalMinutes * 60000),
            reachedDays: reached,
            activeDays: dayList.length,
            percent: dayList.length ? Math.round((reached / dayList.length) * 100) : 0
        };
    }

    // Longest run of consecutive days with at least one call.
    let streak = 0;
    let run = 0;
    let previousStart = null;
    dayList.forEach((day) => {
        const isNext = previousStart !== null && Math.round((day.startMs - previousStart) / REPORT_DAY_MS) === 1;
        run = isNext ? run + 1 : 1;
        streak = Math.max(streak, run);
        previousStart = day.startMs;
    });

    let bestDay = null;
    dayList.forEach((day) => {
        if (!bestDay || day.earnings > bestDay.earnings) bestDay = day;
    });
    if (bestDay) {
        const d = new Date(bestDay.startMs);
        bestDay = {
            earnings: bestDay.earnings,
            calls: bestDay.calls,
            label: `${REPORT_WEEKDAYS[reportMondayIndex(d)]} ${REPORT_MONTH_SHORT[d.getMonth()]} ${d.getDate()}`
        };
    }

    let bestWeekIndex = -1;
    weeks.forEach((week, index) => {
        if (week.calls > 0 && (bestWeekIndex < 0 || week.earnings > weeks[bestWeekIndex].earnings)) bestWeekIndex = index;
    });

    // Heatmap hours: at least 6 AM to 9 PM, wider if there is work outside that.
    const hourTotals = new Array(24).fill(0);
    heat.forEach((row) => row.forEach((v, h) => { hourTotals[h] += v; }));
    let firstHour = 6;
    let lastHour = 21;
    hourTotals.forEach((v, h) => {
        if (v > 0) {
            firstHour = Math.min(firstHour, h);
            lastHour = Math.max(lastHour, h);
        }
    });
    let maxCell = 0;
    heat.forEach((row) => row.forEach((v) => { if (v > maxCell) maxCell = v; }));
    let bestWindow = null;
    let bestWindowMinutes = 0;
    for (let h = 0; h < 24; h += 1) {
        const sum = hourTotals[h] + hourTotals[(h + 1) % 24] + hourTotals[(h + 2) % 24];
        if (sum > bestWindowMinutes) {
            bestWindowMinutes = sum;
            bestWindow = `${reportFormatHour(h)} to ${reportFormatHour(h + 3)}`;
        }
    }

    // Time on the platform comes from the saved work sessions that ended in this month.
    const monthSessions = (Array.isArray(data.sessions) ? data.sessions : []).filter((s) => s && Number(s.endedAtMs) >= range.startMs && Number(s.endedAtMs) < range.endMs);
    let time = null;
    if (monthSessions.length) {
        const connectedMs = monthSessions.reduce((sum, s) => sum + (Number(s.availableMs) || 0), 0);
        const sessionTalkMs = monthSessions.reduce((sum, s) => sum + (Number(s.talkMs) || 0), 0);
        const sessionEarned = monthSessions.reduce((sum, s) => sum + (Number(s.earned) || 0), 0);
        if (connectedMs > 0) {
            time = {
                sessions: monthSessions.length,
                connectedMs,
                talkMs: sessionTalkMs,
                idleMs: Math.max(0, connectedMs - sessionTalkMs),
                utilization: Math.min(100, Math.round((sessionTalkMs / connectedMs) * 100)),
                perConnectedHour: sessionEarned / (connectedMs / REPORT_HOUR_MS),
                perTalkHour: sessionTalkMs > 0 ? sessionEarned / (sessionTalkMs / REPORT_HOUR_MS) : 0
            };
        }
    }

    const cycles = [];
    (Array.isArray(data.paymentCycles) ? data.paymentCycles : []).forEach((cycle) => {
        const cycleRange = reportCycleRange(cycle);
        if (!cycleRange || cycleRange.endMs <= range.startMs || cycleRange.startMs >= range.endMs) return;
        const inside = allCalls.filter((c) => c.startMs >= cycleRange.startMs && c.startMs < cycleRange.endMs);
        cycles.push({
            startMs: cycleRange.startMs,
            label: `${reportShortDate(cycleRange.startMs)} to ${reportShortDate(cycleRange.endMs - REPORT_DAY_MS)}`,
            calls: inside.length,
            minutes: inside.reduce((sum, c) => sum + c.durationMs / 60000, 0),
            earned: inside.reduce((sum, c) => sum + c.earnings, 0)
        });
    });
    cycles.sort((a, b) => a.startMs - b.startMs);

    return {
        range,
        hasData: totals.calls > 0,
        totals,
        weeks,
        bestWeekIndex,
        byRate,
        goal,
        activeDays: dayList.length,
        streak,
        bestDay,
        heat,
        heatHours: { from: firstHour, to: lastHour },
        heatMax: maxCell,
        bestWindow,
        time,
        cycles
    };
}

// ---------------------------------------------------------------- report HTML

function reportHeatCellStyle(minutes, maxMinutes) {
    if (!(minutes > 0) || !(maxMinutes > 0)) return 'opacity:0.07';
    const strength = 0.12 + 0.88 * Math.min(1, minutes / maxMinutes);
    return `opacity:${strength.toFixed(2)}`;
}

function renderMonthlyReportHtml(report, theme, generatedLabel) {
    const e = escapeHTML;
    const r = report;
    const t = r.totals;
    const generated = e(generatedLabel || '');
    const header = (title, subtitle) => `
        <header class="wtt-report-head">
            <div>
                <div class="wtt-report-brand">Work Time Tracker</div>
                <h1 class="wtt-report-title">${e(title)}</h1>
                <div class="wtt-report-sub">${e(subtitle)}</div>
            </div>
            <div class="wtt-report-gen">${generated ? `Generated ${generated}` : ''}</div>
        </header>`;

    const kpis = [
        ['Earnings', reportFormatMoney(t.earnings), 'is-money'],
        ['Calls', reportFormatNumber(t.calls), ''],
        ['Time on calls', reportFormatHoursMinutes(t.talkMs), ''],
        ['Average call', reportFormatMinutesSeconds(t.avgCallMs), '']
    ].map(([label, value, cls]) => `<div class="wtt-report-kpi"><div class="wtt-report-kpi-label">${e(label)}</div><div class="wtt-report-kpi-value ${cls}">${e(value)}</div></div>`).join('');

    const maxWeek = Math.max(0.01, ...r.weeks.map((w) => w.earnings));
    const weekBars = r.weeks.map((w, i) => `
        <div class="wtt-report-bar-col">
            <div class="wtt-report-bar-value${i === r.bestWeekIndex ? ' is-best' : ''}">${e(reportFormatMoney(w.earnings))}</div>
            <div class="wtt-report-bar${i === r.bestWeekIndex ? ' is-best' : ''}" style="height:${Math.max(2, Math.round((w.earnings / maxWeek) * 100))}%"></div>
            <div class="wtt-report-bar-label">${e(w.label)}</div>
        </div>`).join('');

    const rateRows = r.byRate.map((row) => `
        <div class="wtt-report-row">
            <div class="is-strong">${e(row.name)}</div>
            <div class="is-num">${e(reportFormatNumber(row.calls))}</div>
            <div class="is-num">${e(reportFormatNumber(row.minutes))}</div>
            <div class="is-num">${e(reportFormatMoney(row.rate))}</div>
            <div class="is-num is-strong">${e(reportFormatMoney(row.earned))}</div>
        </div>`).join('');
    const totalPerMinute = t.talkMs > 0 ? t.earnings / (t.talkMs / 60000) : 0;

    const cycleBlock = r.cycles.length ? `
        <div class="wtt-report-block">
            <h2>Payment cycles</h2>
            <div class="wtt-report-table is-cycles">
                <div class="wtt-report-row is-head"><div>Cycle</div><div class="is-num">Calls</div><div class="is-num">Minutes</div><div class="is-num">Earned</div></div>
                ${r.cycles.map((c) => `<div class="wtt-report-row"><div class="is-strong">${e(c.label)}</div><div class="is-num">${e(reportFormatNumber(c.calls))}</div><div class="is-num">${e(reportFormatNumber(c.minutes))}</div><div class="is-num is-strong">${e(reportFormatMoney(c.earned))}</div></div>`).join('')}
            </div>
        </div>` : '';

    const page1 = `
    <section class="wtt-report-page">
        ${header('Monthly report', `${r.range.label}`)}
        <div class="wtt-report-rule"></div>
        <div class="wtt-report-kpis">${kpis}</div>
        <div class="wtt-report-block">
            <div class="wtt-report-block-head"><h2>Earnings by week</h2><span>Total ${e(reportFormatMoney(t.earnings))}</span></div>
            <div class="wtt-report-chart">${weekBars}</div>
            <div class="wtt-report-note">The brightest bar marks the best week.</div>
        </div>
        <div class="wtt-report-block">
            <h2>Earnings by rate</h2>
            <div class="wtt-report-table">
                <div class="wtt-report-row is-head"><div>Rate</div><div class="is-num">Calls</div><div class="is-num">Minutes</div><div class="is-num">Per min</div><div class="is-num">Earned</div></div>
                ${rateRows}
                <div class="wtt-report-row is-total"><div>Total</div><div class="is-num">${e(reportFormatNumber(t.calls))}</div><div class="is-num">${e(reportFormatNumber(t.talkMs / 60000))}</div><div class="is-num">${e(reportFormatMoney(totalPerMinute))}</div><div class="is-num is-money">${e(reportFormatMoney(t.earnings))}</div></div>
            </div>
        </div>
        ${cycleBlock}
        <footer class="wtt-report-foot"><span>Generated on this device. Your data is never uploaded.</span><span>Page 1 of 2</span></footer>
    </section>`;

    const goalCard = r.goal ? `
        <div class="wtt-report-card">
            <div class="wtt-report-big"><b>${e(String(r.goal.reachedDays))}</b><span>of ${e(String(r.goal.activeDays))} active days reached ${e(r.goal.targetLabel)}</span></div>
            <div class="wtt-report-meter"><i style="width:${r.goal.percent}%"></i></div>
            <div class="wtt-report-note">${e(String(r.goal.percent))}% of days on target</div>
            <div class="wtt-report-line is-first"><span>Active days</span><b>${e(String(r.activeDays))} of ${e(String(r.range.daysInMonth))}</b></div>
            <div class="wtt-report-line"><span>Longest streak</span><b>${e(String(r.streak))} ${r.streak === 1 ? 'day' : 'days'}</b></div>
        </div>` : `
        <div class="wtt-report-card">
            <div class="wtt-report-line"><span>Active days</span><b>${e(String(r.activeDays))} of ${e(String(r.range.daysInMonth))}</b></div>
            <div class="wtt-report-line"><span>Longest streak</span><b>${e(String(r.streak))} ${r.streak === 1 ? 'day' : 'days'}</b></div>
            <div class="wtt-report-note">Set a daily goal in Settings to see how often you reach it.</div>
        </div>`;

    const timeCard = r.time ? `
        <div class="wtt-report-card">
            <div class="wtt-report-split"><i style="width:${r.time.utilization}%"></i></div>
            <div class="wtt-report-split-legend"><span>On calls ${e(String(r.time.utilization))}%</span><span>Waiting ${e(String(100 - r.time.utilization))}%</span></div>
            <div class="wtt-report-line is-first"><span>Connected</span><b>${e(reportFormatHoursMinutes(r.time.connectedMs))}</b></div>
            <div class="wtt-report-line"><span>Per connected hour</span><b>${e(reportFormatMoney(r.time.perConnectedHour))}</b></div>
            <div class="wtt-report-line"><span>Per hour on calls</span><b>${e(reportFormatMoney(r.time.perTalkHour))}</b></div>
        </div>` : `
        <div class="wtt-report-card">
            <div class="wtt-report-note">Start a work session on the Work screen to see connected time and what you earn per hour connected.</div>
        </div>`;

    const hourCount = r.heatHours.to - r.heatHours.from + 1;
    const hourLabels = Array.from({ length: hourCount }, (_, i) => {
        const h = r.heatHours.from + i;
        return `<div>${h % 3 === 0 ? h : ''}</div>`;
    }).join('');
    const heatRows = r.heat.map((row, d) => `
        <div class="wtt-report-heat-row" style="--cols:${hourCount}">
            <div class="wtt-report-heat-day">${REPORT_WEEKDAYS[d]}</div>
            ${row.slice(r.heatHours.from, r.heatHours.to + 1).map((v) => `<div class="wtt-report-heat-cell" style="${reportHeatCellStyle(v, r.heatMax)}"></div>`).join('')}
        </div>`).join('');
    const bestLine = [
        r.bestWindow ? `Best window: ${r.bestWindow}.` : '',
        r.bestDay ? `Best day: ${r.bestDay.label}, ${reportFormatMoney(r.bestDay.earnings)}.` : ''
    ].filter(Boolean).join(' ');

    const page2 = `
    <section class="wtt-report-page">
        <header class="wtt-report-head is-compact"><div class="wtt-report-brand">Work Time Tracker</div><div class="wtt-report-gen">${e(r.range.label)}</div></header>
        <div class="wtt-report-two">
            <div class="wtt-report-block"><h2>Daily goal</h2>${goalCard}</div>
            <div class="wtt-report-block"><h2>Time on the platform</h2>${timeCard}</div>
        </div>
        <div class="wtt-report-block">
            <div class="wtt-report-block-head"><h2>When you work</h2><span>Minutes on calls, by weekday and hour</span></div>
            <div class="wtt-report-heat">
                <div class="wtt-report-heat-row is-hours" style="--cols:${hourCount}"><div></div>${hourLabels}</div>
                ${heatRows}
                <div class="wtt-report-heat-legend"><span>Less</span><i style="opacity:0.12"></i><i style="opacity:0.35"></i><i style="opacity:0.6"></i><i style="opacity:0.85"></i><i style="opacity:1"></i><span>More</span></div>
            </div>
            ${bestLine ? `<div class="wtt-report-best">${e(bestLine)}</div>` : ''}
        </div>
        <footer class="wtt-report-foot"><span>Generated on this device. Your data is never uploaded.</span><span>Page 2 of 2</span></footer>
    </section>`;

    return `<div class="wtt-report" data-theme="${theme === 'light' ? 'light' : 'dark'}">${page1}${page2}</div>`;
}

// ---------------------------------------------------------------- share card

function buildShareCardData(report, options) {
    const showEarnings = Boolean(options && options.showEarnings);
    const r = report;
    const t = r.totals;
    const utilization = r.time ? r.time.utilization : null;
    const maxWeek = Math.max(1, ...r.weeks.map((w) => w.talkMs));
    return {
        title: r.range.label,
        heroLabel: 'Time on calls',
        hero: reportFormatHoursMinutes(t.talkMs),
        heroNote: utilization !== null ? `${utilization}% of the time I was connected` : `${reportFormatNumber(t.calls)} calls this month`,
        tiles: [
            ['Calls', reportFormatNumber(t.calls)],
            ['Average call', `${Math.round(t.avgCallMs / 60000)} min`],
            ['Active days', String(r.activeDays)]
        ],
        lastTiles: [
            ['Longest streak', `${r.streak} ${r.streak === 1 ? 'day' : 'days'}`],
            showEarnings
                ? ['Earned', reportFormatMoney(t.earnings), true]
                : (r.goal ? ['Days on my goal', `${r.goal.reachedDays} of ${r.goal.activeDays}`, true] : ['Best week', r.bestWeekIndex >= 0 ? r.weeks[r.bestWeekIndex].label : '-', true])
        ],
        // Bars show time on calls, never money, so hiding earnings really hides them.
        bars: r.weeks.map((w, i) => ({ label: w.label, ratio: w.talkMs / maxWeek, best: i === r.bestWeekIndex })),
        showsEarnings: showEarnings
    };
}

function reportRoundRect(ctx, x, y, w, h, radius) {
    const rad = Math.min(radius, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.arcTo(x + w, y, x + w, y + h, rad);
    ctx.arcTo(x + w, y + h, x, y + h, rad);
    ctx.arcTo(x, y + h, x, y, rad);
    ctx.arcTo(x, y, x + w, y, rad);
    ctx.closePath();
}

function drawShareCard(canvas, card) {
    const W = 1080;
    const H = 1350;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';
    const font = (size, weight) => `${weight || 400} ${size}px ${MONO}`;

    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#020617');
    bg.addColorStop(1, '#0f172a');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 520);
    glow.addColorStop(0, 'rgba(59,130,246,0.18)');
    glow.addColorStop(1, 'rgba(59,130,246,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#60a5fa';
    ctx.font = font(24, 700);
    ctx.fillText('MY MONTH IN CALLS', 72, 120);
    ctx.fillStyle = '#ffffff';
    ctx.font = font(62, 700);
    ctx.fillText(card.title, 72, 196);

    const panel = (x, y, w, h, radius) => {
        reportRoundRect(ctx, x, y, w, h, radius);
        ctx.fillStyle = '#1e293b';
        ctx.fill();
        ctx.strokeStyle = 'rgba(148,163,184,0.22)';
        ctx.lineWidth = 2;
        ctx.stroke();
    };

    panel(72, 250, 936, 300, 20);
    ctx.fillStyle = '#94a3b8';
    ctx.font = font(26, 400);
    ctx.fillText(card.heroLabel, 116, 312);
    ctx.fillStyle = '#34d399';
    ctx.font = font(128, 700);
    let heroSize = 128;
    while (ctx.measureText(card.hero).width > 848 && heroSize > 60) {
        heroSize -= 4;
        ctx.font = font(heroSize, 700);
    }
    ctx.fillText(card.hero, 116, 440);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = font(24, 400);
    ctx.fillText(card.heroNote, 116, 506);

    const tileW = (936 - 40) / 3;
    card.tiles.forEach(([label, value], i) => {
        const x = 72 + i * (tileW + 20);
        panel(x, 590, tileW, 170, 16);
        ctx.fillStyle = '#94a3b8';
        ctx.font = font(22, 400);
        ctx.fillText(label, x + 28, 640);
        ctx.fillStyle = '#ffffff';
        let size = 60;
        ctx.font = font(size, 700);
        while (ctx.measureText(value).width > tileW - 56 && size > 28) {
            size -= 2;
            ctx.font = font(size, 700);
        }
        ctx.fillText(value, x + 28, 725);
    });

    const halfW = (936 - 20) / 2;
    card.lastTiles.forEach(([label, value, accent], i) => {
        const x = 72 + i * (halfW + 20);
        panel(x, 780, halfW, 170, 16);
        ctx.fillStyle = '#94a3b8';
        ctx.font = font(22, 400);
        ctx.fillText(label, x + 28, 830);
        ctx.fillStyle = accent ? '#34d399' : '#ffffff';
        let size = 54;
        ctx.font = font(size, 700);
        while (ctx.measureText(value).width > halfW - 56 && size > 26) {
            size -= 2;
            ctx.font = font(size, 700);
        }
        ctx.fillText(value, x + 28, 912);
    });

    ctx.fillStyle = '#94a3b8';
    ctx.font = font(22, 400);
    ctx.fillText('Busiest weeks', 72, 1008);
    const chartTop = 1030;
    const chartBottom = 1196;
    const count = Math.max(1, card.bars.length);
    const gap = 20;
    const barW = (936 - gap * (count - 1)) / count;
    card.bars.forEach((bar, i) => {
        const h = Math.max(6, Math.round((chartBottom - chartTop) * bar.ratio));
        const x = 72 + i * (barW + gap);
        reportRoundRect(ctx, x, chartBottom - h, barW, h, 8);
        ctx.fillStyle = bar.best ? '#34d399' : 'rgba(52,211,153,0.45)';
        ctx.fill();
    });

    ctx.strokeStyle = 'rgba(148,163,184,0.22)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(72, 1244);
    ctx.lineTo(1008, 1244);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = font(26, 700);
    ctx.fillText('Work Time Tracker', 72, 1292);
    ctx.fillStyle = '#94a3b8';
    ctx.font = font(20, 400);
    ctx.textAlign = 'right';
    ctx.fillText('untopo.github.io/work-time-tracker', 1008, 1292);
    ctx.textAlign = 'left';
}
