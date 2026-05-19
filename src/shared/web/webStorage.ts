export const webStorage = {
  getItem: (key: string): Promise<string | null> => {
    try {
      return Promise.resolve(window.localStorage.getItem(key));
    } catch {
      return Promise.resolve(null);
    }
  },
  setItem: (key: string, value: string): Promise<void> => {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // localStorage full or unavailable
    }
    return Promise.resolve();
  },
  removeItem: (key: string): Promise<void> => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
    return Promise.resolve();
  },
};
