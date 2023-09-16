declare namespace chrome.storage {
  export interface SyncStorageArea extends Omit<chrome.storage.SyncStorageArea, 'get'> {
    get: <T = { [key: string]: any }>(keys: { [key: string]: any }, callback: (items: T) => void) => void;
  }
  export interface SyncStorageArea extends Omit<chrome.storage.SyncStorageArea, 'set'> {
    set: <T = { [key: T]: any }>(keys: { [Property in keyof typeof globalThis.settings]: (typeof globalThis.settings)[Property] }, callback: (items) => void) => void;
  }
}
