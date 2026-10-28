// Sync survey: only listed answers become anonymous event names, and the banner appears only when it should.
// Run with: npm run test:unit
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadCore, plain } from './load-core.mjs';

const { core, run } = loadCore();
const DEVICES = plain(run('SYNC_SURVEY_DEVICES'));
const OPTIONS = plain(run('SYNC_SURVEY_OPTIONS'));
const DAY = 24 * 60 * 60 * 1000;
const base = { state: null, nowMs: 1_000_000_000_000, callCount: 5, analyticsOn: true, isNative: false, callActive: false, modalOpen: false, otherBannerOpen: false };
const show = (over) => core.shouldShowSyncSurvey({ ...base, ...over });

test('answers become only the fixed event names, in order', () => {
  assert.deepEqual(plain(core.buildSyncSurveyEvents({ devices: 'two', sync: 'both' })), ['survey/devices/two', 'survey/sync/both']);
  assert.deepEqual(plain(core.buildSyncSurveyEvents({ devices: 'three-plus', sync: 'as-is' })), ['survey/devices/three-plus', 'survey/sync/as-is']);
});

test('anything that is not on the lists is dropped, including free text', () => {
  assert.deepEqual(plain(core.buildSyncSurveyEvents({ devices: 'my phone is a Pixel 7', sync: '<b>x</b>', comment: 'hello' })), []);
  assert.deepEqual(plain(core.buildSyncSurveyEvents({ devices: 'one', sync: 'other' })), ['survey/devices/one']);
  for (const bad of [null, undefined, 'x', 5, []]) assert.deepEqual(plain(core.buildSyncSurveyEvents(bad)), []);
});

test('every option the survey offers produces an allowed name', () => {
  for (const d of DEVICES) assert.match(core.buildSyncSurveyEvents({ devices: d.value })[0], /^survey\/devices\/(one|two|three-plus)$/);
  for (const o of OPTIONS) assert.match(core.buildSyncSurveyEvents({ sync: o.value })[0], /^survey\/sync\/(as-is|direct|account|both)$/);
  assert.equal(OPTIONS.length, 4);
});

test('saved state is repaired when it is junk', () => {
  for (const bad of [null, undefined, '', 'nope', '{"status":"weird"}', 12, []]) assert.equal(core.normalizeSyncSurveyState(bad).status, 'new');
  assert.equal(core.normalizeSyncSurveyState('{"status":"never","at":5}').status, 'never');
  assert.equal(core.normalizeSyncSurveyState({ status: 'later', at: 'x' }).at, 0);
});

test('state moves with the three actions', () => {
  assert.deepEqual(plain(core.nextSyncSurveyState('later', 10)), { status: 'later', at: 10 });
  assert.deepEqual(plain(core.nextSyncSurveyState('never', 10)), { status: 'never', at: 10 });
  assert.deepEqual(plain(core.nextSyncSurveyState('done', 10)), { status: 'done', at: 10 });
  assert.equal(core.nextSyncSurveyState('???', 10).status, 'new');
});

test('the banner shows for a real web user who has not decided yet', () => {
  assert.equal(show({}), true);
});

test('it never shows without saved calls, with counts off, in the native apps, during a call or over another window', () => {
  assert.equal(show({ callCount: 0 }), false);
  assert.equal(show({ analyticsOn: false }), false);
  assert.equal(show({ isNative: true }), false);
  assert.equal(show({ callActive: true }), false);
  assert.equal(show({ modalOpen: true }), false);
  assert.equal(show({ otherBannerOpen: true }), false);
});

test('"No thanks" and "done" mean never again; "Maybe later" waits a week', () => {
  const t = base.nowMs;
  assert.equal(show({ state: { status: 'never', at: t - 100 * DAY } }), false);
  assert.equal(show({ state: { status: 'done', at: t - 100 * DAY } }), false);
  assert.equal(show({ state: { status: 'later', at: t - 6 * DAY } }), false);
  assert.equal(show({ state: { status: 'later', at: t - 7 * DAY } }), true);
  assert.equal(show({ state: JSON.stringify({ status: 'later', at: t - 1 * DAY }) }), false);
});
