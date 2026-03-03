const statusText = document.getElementById('overlay-status-text');
const rateName = document.getElementById('overlay-rate-name');
const timerText = document.getElementById('overlay-timer');
const earningsText = document.getElementById('overlay-earnings');
const noteText = document.getElementById('overlay-note');
const primaryBtn = document.getElementById('overlay-primary-btn');
const addCallBtn = document.getElementById('overlay-add-call-btn');
const openAppBtn = document.getElementById('overlay-open-app-btn');

const tauriInvoke = typeof window.__TAURI_INTERNALS__?.invoke === 'function'
  ? window.__TAURI_INTERNALS__.invoke
  : null;
const tauriTransformCallback = typeof window.__TAURI_INTERNALS__?.transformCallback === 'function'
  ? window.__TAURI_INTERNALS__.transformCallback
  : null;

let currentPrimaryAction = 'show-main';

function createTauriEventTarget(label) {
  return typeof label === 'string' && label
    ? { kind: 'AnyLabel', label }
    : { kind: 'Any' };
}

async function tauriEmitTo(label, event, payload) {
  if (!tauriInvoke) return;
  await tauriInvoke('plugin:event|emit_to', {
    target: createTauriEventTarget(label),
    event,
    payload
  });
}

async function tauriListen(event, handler) {
  if (!tauriInvoke || !tauriTransformCallback) return null;
  return tauriInvoke('plugin:event|listen', {
    event,
    target: createTauriEventTarget(),
    handler: tauriTransformCallback(handler)
  });
}

function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
}

function applyState(payload = {}) {
  const action = String(payload.primaryAction || 'show-main');
  currentPrimaryAction = action;
  applyTheme(payload.theme === 'dark' ? 'dark' : 'light');
  statusText.textContent = String(payload.statusText || 'Ready');
  rateName.textContent = String(payload.rateName || 'Select a rate in the main app');
  timerText.textContent = String(payload.timerText || '00:00:00');
  earningsText.textContent = String(payload.earningsText || '$0.00');
  noteText.textContent = String(payload.noteText || 'The overlay stays on top while you work in other windows.');

  if (action === 'end-call') {
    primaryBtn.textContent = 'End Call';
    primaryBtn.dataset.mode = 'end';
  } else if (action === 'start-call') {
    primaryBtn.textContent = 'Start Call';
    primaryBtn.dataset.mode = 'start';
  } else {
    primaryBtn.textContent = 'Select Rate';
    primaryBtn.dataset.mode = 'select';
  }
}

async function emitAction(action) {
  await tauriEmitTo('main', 'desktop-overlay-action', { action });
}

primaryBtn?.addEventListener('click', () => {
  void emitAction(currentPrimaryAction);
});

addCallBtn?.addEventListener('click', () => {
  void emitAction('add-call');
});

openAppBtn?.addEventListener('click', () => {
  void emitAction('show-main');
});

window.addEventListener('DOMContentLoaded', async () => {
  await tauriListen('desktop-overlay-state', (event) => {
    applyState(event?.payload || {});
  });
  await emitAction('overlay-ready');
});
