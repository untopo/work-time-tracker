const infoCard = document.getElementById('overlay-info-card');
const statusText = document.getElementById('overlay-status-text');
const rateName = document.getElementById('overlay-rate-name');
const timerText = document.getElementById('overlay-timer');
const earningsText = document.getElementById('overlay-earnings');
const primaryBtn = document.getElementById('overlay-primary-btn');
const primaryIcon = document.getElementById('overlay-primary-icon');

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

function applyPrimaryAction(action) {
  currentPrimaryAction = action;
  if (action === 'end-call') {
    primaryBtn.dataset.mode = 'end';
    primaryBtn.setAttribute('aria-label', 'End Call');
    primaryBtn.setAttribute('title', 'End Call');
    primaryIcon.textContent = '■';
    return;
  }

  if (action === 'start-call') {
    primaryBtn.dataset.mode = 'start';
    primaryBtn.setAttribute('aria-label', 'Start Call');
    primaryBtn.setAttribute('title', 'Start Call');
    primaryIcon.textContent = '▶';
    return;
  }

  primaryBtn.dataset.mode = 'select';
  primaryBtn.setAttribute('aria-label', 'Open App');
  primaryBtn.setAttribute('title', 'Open App');
  primaryIcon.textContent = '↗';
}

function applyState(payload = {}) {
  const mode = String(payload.mode || 'select');
  applyTheme(payload.theme === 'dark' ? 'dark' : 'light');
  infoCard.dataset.mode = mode;
  statusText.textContent = String(payload.statusText || 'Select Rate');

  const showRate = !!payload.showRateName;
  rateName.textContent = String(payload.rateName || '');
  rateName.style.display = showRate ? '' : 'none';

  const showTimer = !!payload.showTimer;
  timerText.textContent = String(payload.timerText || '00:00:00');
  timerText.style.display = showTimer ? '' : 'none';

  const showEarnings = !!payload.showEarnings;
  earningsText.textContent = String(payload.earningsText || '$0.00');
  earningsText.style.display = showEarnings ? '' : 'none';

  applyPrimaryAction(String(payload.primaryAction || 'show-main'));
}

async function emitAction(action) {
  await tauriEmitTo('main', 'desktop-overlay-action', { action });
}

primaryBtn?.addEventListener('click', () => {
  void emitAction(currentPrimaryAction);
});

window.addEventListener('DOMContentLoaded', async () => {
  await tauriListen('desktop-overlay-state', (event) => {
    applyState(event?.payload || {});
  });
  await emitAction('overlay-ready');
});
