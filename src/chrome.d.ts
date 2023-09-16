declare namespace chrome.storage {
  export interface SyncStorageArea extends Omit<chrome.storage.SyncStorageArea, 'get'> {
    get: <T = { [key: string]: any }>(keys: { [key: string]: any }, callback: (items: T) => void) => void;
  }
  export interface SyncStorageArea extends Omit<chrome.storage.SyncStorageArea, 'set'> {
    set: <T = { [key: string]: any }>(keys: { [Property in keyof T]: T[Property] }, callback: (items) => void) => void;
  }
}
