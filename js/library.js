/* ==========================================================================
   留白 WHITE SPACE · 本地照片库（IndexedDB）
   纯前端保存用户自己加的照片，刷新后仍然在；不涉及任何服务器
   ========================================================================== */

window.Library = (function () {
  "use strict";

  const NAME = "whitespace_photos";
  const STORE = "photos";
  const VERSION = 1;
  const supported = !!window.indexedDB;

  let promise = null;

  function open() {
    if (!supported) return Promise.reject(new Error("IndexedDB unsupported"));
    if (!promise) {
      promise = new Promise((resolve, reject) => {
        const req = indexedDB.open(NAME, VERSION);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(STORE)) {
            db.createObjectStore(STORE, { keyPath: "id" });
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    }
    return promise;
  }

  function run(mode, fn) {
    return open().then((db) => new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, mode);
      const store = tx.objectStore(STORE);
      const req = fn(store);
      tx.oncomplete = () => resolve(req.result);
      tx.onerror = () => reject(tx.error);
      req.onerror = () => reject(req.error);
    }));
  }

  return {
    supported,
    all: () => run("readonly", (s) => s.getAll()),
    add: (rec) => run("readwrite", (s) => s.put(rec)).then(() => rec),
    remove: (id) => run("readwrite", (s) => s.delete(id)),
    clear: () => run("readwrite", (s) => s.clear())
  };
})();
