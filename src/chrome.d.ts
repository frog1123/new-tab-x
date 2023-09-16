declare namespace chrome.storage {
  export interface SyncStorageArea extends Omit<chrome.storage.SyncStorageArea, 'get'> {
    get: <T = { [key: string]: any }>(keys: T, callback: (items: T) => void) => void;
  }
  export interface SyncStorageArea extends Omit<chrome.storage.SyncStorageArea, 'set'> {
    set: <T = { [key: T]: any }>(keys: { [key: string]: any }, callback: (items) => void) => void;
  }
}
