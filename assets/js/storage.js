(function bootstrapWTTStorage(global) {
  const memoryStore = new Map();
  const INTERNAL_SYNC_MARKER_KEY = '__wtt_native_storage_synced__';
  const hasTauriRuntime = Boolean(global.__TAURI_INTERNALS__ || global.__TAURI__ || global.__TAURI_METADATA__);

  function createMemoryBackend() {
    return {
      length: 0,
      key(index) {
        return Array.from(memoryStore.keys())[index] || null;
      },
      getItem(key) {
        return memoryStore.has(key) ? memoryStore.get(key) : null;
      },
      setItem(key, value) {
        memoryStore.set(String(key), String(value));
        this.length = memoryStore.size;
      },
      removeItem(key) {
        memoryStore.delete(String(key));
        this.length = memoryStore.size;
      },
      clear() {
        memoryStore.clear();
        this.length = 0;
      }
    };
  }

  function createLocalBackend() {
    if (!global.localStorage) return createMemoryBackend();
    return global.localStorage;
  }

  function isStorageBackend(candidate) {
    return candidate
      && typeof candidate.getItem === 'function'
      && typeof candidate.setItem === 'function'
      && typeof candidate.removeItem === 'function'
      && typeof candidate.clear === 'function';
  }

  function getTauriInvoke() {
    if (global.__TAURI_INTERNALS__ && typeof global.__TAURI_INTERNALS__.invoke === 'function') {
      return global.__TAURI_INTERNALS__.invoke;
    }
    return null;
  }

  function serializeStorage(backend) {
    const snapshot = {};
    const total = Number(backend.length) || 0;
    for (let i = 0; i < total; i += 1) {
      const key = backend.key(i);
      if (!key || key === INTERNAL_SYNC_MARKER_KEY) continue;
      const value = backend.getItem(key);
      if (value !== null) snapshot[key] = value;
    }
    return snapshot;
  }

  function createTauriBridgeBackend(baseBackend) {
    const invoke = getTauriInvoke();
    if (!invoke || !isStorageBackend(baseBackend)) return null;

    let persistTimer = null;
    let hydrated = false;
    let hydrationPromise = null;

    function persistNow() {
      return invoke('save_storage_snapshot', {
        snapshot: serializeStorage(baseBackend)
      }).catch((error) => {
        console.error('Failed to persist native storage snapshot:', error);
      });
    }

    function schedulePersist() {
      if (persistTimer !== null) clearTimeout(persistTimer);
      persistTimer = setTimeout(() => {
        persistTimer = null;
        void persistNow();
      }, 150);
    }

    function hydrateFromNative() {
      if (hydrationPromise) return hydrationPromise;
      hydrationPromise = invoke('load_storage_snapshot')
        .then((snapshot) => {
          const currentSnapshot = serializeStorage(baseBackend);
          const hasBrowserData = Object.keys(currentSnapshot).length > 0;
          const nativeSnapshot = snapshot && typeof snapshot === 'object' ? snapshot : {};
          const hasNativeData = Object.keys(nativeSnapshot).length > 0;

          if (!hasBrowserData && hasNativeData) {
            Object.entries(nativeSnapshot).forEach(([key, value]) => {
              if (typeof value === 'string') {
                baseBackend.setItem(key, value);
              }
            });
            baseBackend.setItem(INTERNAL_SYNC_MARKER_KEY, '1');
            hydrated = true;
            if (global.location && typeof global.location.reload === 'function') {
              global.location.reload();
              return;
            }
          } else if (hasBrowserData) {
            baseBackend.setItem(INTERNAL_SYNC_MARKER_KEY, '1');
            schedulePersist();
          }

          hydrated = true;
        })
        .catch((error) => {
          console.error('Failed to hydrate native storage snapshot:', error);
          hydrated = true;
        });
      return hydrationPromise;
    }

    void hydrateFromNative();
    global.addEventListener('beforeunload', () => {
      if (!hydrated) return;
      void persistNow();
    });
    global.addEventListener('pagehide', () => {
      if (!hydrated) return;
      void persistNow();
    });

    return {
      get length() {
        return baseBackend.length;
      },
      key(index) {
        return baseBackend.key(index);
      },
      getItem(key) {
        return baseBackend.getItem(key);
      },
      setItem(key, value) {
        baseBackend.setItem(String(key), String(value));
        if (key !== INTERNAL_SYNC_MARKER_KEY) schedulePersist();
      },
      removeItem(key) {
        baseBackend.removeItem(String(key));
        if (key !== INTERNAL_SYNC_MARKER_KEY) schedulePersist();
      },
      clear() {
        baseBackend.clear();
        schedulePersist();
      }
    };
  }

  let backendName = 'memory';
  let backend = createMemoryBackend();

  const localBackend = createLocalBackend();
  const tauriBackend = hasTauriRuntime ? createTauriBridgeBackend(localBackend) : null;

  if (isStorageBackend(tauriBackend)) {
    backend = tauriBackend;
    backendName = 'tauri-bridge';
  } else if (isStorageBackend(localBackend)) {
    backend = localBackend;
    backendName = global.localStorage ? 'localStorage' : 'memory';
  }

  const api = {
    backendName,
    env: {
      isTauri: hasTauriRuntime,
      isBrowser: !hasTauriRuntime
    },
    key(index) {
      return backend.key(index);
    },
    get length() {
      return backend.length;
    },
    getItem(key) {
      return backend.getItem(String(key));
    },
    setItem(key, value) {
      backend.setItem(String(key), String(value));
    },
    removeItem(key) {
      backend.removeItem(String(key));
    },
    clear() {
      backend.clear();
    }
  };

  global.WTTStorage = api;
  global.WTTEnv = api.env;
})(window);
