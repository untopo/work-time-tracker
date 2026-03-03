const overlayPanel = document.getElementById('overlay-panel');
const dragZone = document.getElementById('overlay-drag-zone');
const activeCard = document.getElementById('overlay-active-card');
const activeRate = document.getElementById('overlay-active-rate');
const activeTimer = document.getElementById('overlay-active-timer');
const activeEarnings = document.getElementById('overlay-active-earnings');
const primaryBtn = document.getElementById('overlay-primary-btn');
const primaryIcon = document.getElementById('overlay-primary-icon');
const primaryLabel = document.getElementById('overlay-primary-label');
const secondaryBtn = document.getElementById('overlay-secondary-btn');
const minimizeBtn = document.getElementById('overlay-minimize-btn');
const closeBtn = document.getElementById('overlay-close-btn');

const tauriInvoke = typeof window.__TAURI_INTERNALS__?.invoke === 'function'
  ? window.__TAURI_INTERNALS__.invoke
  : null;
const tauriTransformCallback = typeof window.__TAURI_INTERNALS__?.transformCallback === 'function'
  ? window.__TAURI_INTERNALS__.transformCallback
  : null;

let currentPrimaryAction = 'show-main';
let dragState = null;
let dragFrameRequested = false;

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
  primaryBtn.dataset.mode = action;

  if (action === 'end-call') {
    primaryBtn.setAttribute('aria-label', 'End Call');
    primaryBtn.setAttribute('title', 'End Call');
    primaryIcon.textContent = 'â– ';
    primaryLabel.textContent = 'End Call';
    return;
  }

  if (action === 'start-call') {
    primaryBtn.setAttribute('aria-label', 'Start Call');
    primaryBtn.setAttribute('title', 'Start Call');
    primaryIcon.textContent = 'â–¶';
    primaryLabel.textContent = 'Start Call';
    return;
  }

  primaryBtn.setAttribute('aria-label', 'Open App');
  primaryBtn.setAttribute('title', 'Open App');
  primaryIcon.textContent = 'â†—';
  primaryLabel.textContent = 'Open App';
}

function applyState(payload = {}) {
  const liveCallActive = !!payload.liveCallActive;
  applyTheme(payload.theme === 'dark' ? 'dark' : 'light');
  applyPrimaryAction(String(payload.primaryAction || 'show-main'));

  if (liveCallActive) {
    activeCard.style.display = '';
    activeRate.style.display = payload.showRateName ? '' : 'none';
    activeRate.textContent = payload.rateName ? `Rate: ${String(payload.rateName)}` : 'Rate: --';
    activeTimer.textContent = String(payload.timerText || '00:00:00');
    activeEarnings.textContent = String(payload.earningsText || '$0.00');
  } else {
    activeCard.style.display = 'none';
    activeRate.textContent = '';
    activeTimer.textContent = '00:00:00';
    activeEarnings.textContent = '$0.00';
  }
}

async function emitAction(action) {
  await tauriEmitTo('main', 'desktop-overlay-action', { action });
}

async function hideOverlayWindow() {
  if (!tauriInvoke) return;
  await tauriInvoke('set_desktop_overlay_visible', { visible: false });
}

async function beginDrag(event) {
  if (!tauriInvoke) return;
  if (event.button !== 0) return;

  event.preventDefault();
  const position = await tauriInvoke('get_desktop_overlay_position');
  dragState = {
    originScreenX: event.screenX,
    originScreenY: event.screenY,
    originWindowX: Number(position?.x || 0),
    originWindowY: Number(position?.y || 0),
    nextScreenX: event.screenX,
    nextScreenY: event.screenY
  };

  window.addEventListener('pointermove', handleDragMove);
  window.addEventListener('pointerup', endDrag, { once: true });
}

function handleDragMove(event) {
  if (!dragState) return;
  dragState.nextScreenX = event.screenX;
  dragState.nextScreenY = event.screenY;
  if (dragFrameRequested) return;

  dragFrameRequested = true;
  requestAnimationFrame(async () => {
    dragFrameRequested = false;
    if (!dragState || !tauriInvoke) return;

    const deltaX = dragState.nextScreenX - dragState.originScreenX;
    const deltaY = dragState.nextScreenY - dragState.originScreenY;

    await tauriInvoke('set_desktop_overlay_position', {
      x: Math.round(dragState.originWindowX + deltaX),
      y: Math.round(dragState.originWindowY + deltaY)
    });
  });
}

function endDrag() {
  dragState = null;
  window.removeEventListener('pointermove', handleDragMove);
}

primaryBtn?.addEventListener('click', () => {
  void emitAction(currentPrimaryAction);
});

secondaryBtn?.addEventListener('click', () => {
  void emitAction('add-call');
});

minimizeBtn?.addEventListener('click', () => {
  void hideOverlayWindow();
});

closeBtn?.addEventListener('click', () => {
  void emitAction('disable-overlay');
});

dragZone?.addEventListener('pointerdown', (event) => {
  void beginDrag(event);
});

overlayPanel?.addEventListener('pointerdown', (event) => {
  if (event.target.closest('button')) return;
  if (event.target === dragZone) return;
  void beginDrag(event);
});

window.addEventListener('DOMContentLoaded', async () => {
  await tauriListen('desktop-overlay-state', (event) => {
    applyState(event?.payload || {});
  });
  await emitAction('overlay-ready');
});
