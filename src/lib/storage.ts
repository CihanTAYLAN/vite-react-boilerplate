const memoryStorage = new Map<string, string>();

export function isLocalStorageAvailable(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const probeKey = "__storage_probe__";
    window.localStorage.setItem(probeKey, "1");
    window.localStorage.removeItem(probeKey);
    return true;
  } catch {
    return false;
  }
}

export const safeStorage = {
  getItem(key: string): string | null {
    if (isLocalStorageAvailable()) {
      return window.localStorage.getItem(key);
    }

    return memoryStorage.get(key) ?? null;
  },

  setItem(key: string, value: string): void {
    if (isLocalStorageAvailable()) {
      window.localStorage.setItem(key, value);
      return;
    }

    memoryStorage.set(key, value);
  },

  removeItem(key: string): void {
    if (isLocalStorageAvailable()) {
      window.localStorage.removeItem(key);
      return;
    }

    memoryStorage.delete(key);
  },
};
