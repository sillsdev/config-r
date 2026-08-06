// A small promise wrapper over raw IndexedDB, holding the prototype documents.
//
// Documents moved here from localStorage because pasted screenshots blow through
// localStorage's ~5MB shared quota almost immediately. IndexedDB's quota is a large
// fraction of free disk instead, so an image-heavy mockup fits.
//
// Only the documents live here. The tiny document index and last-open id stay in
// localStorage so the toolbar can read them synchronously while rendering.

const kDbName = 'configr-proto';
const kDbVersion = 1;
const kDocStore = 'documents';

let dbPromise: Promise<IDBDatabase> | undefined;

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  const opening = new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(kDbName, kDbVersion);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(kDocStore)) {
        db.createObjectStore(kDocStore, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error('Could not open the document database.'));
    request.onblocked = () =>
      reject(new Error('Another tab is holding the document database open.'));
  });
  // Do not cache a failure: a later call should be free to try again.
  dbPromise = opening.catch((err) => {
    dbPromise = undefined;
    throw err;
  });
  return dbPromise;
}

/**
 * Run one request in its own transaction, resolving when the transaction *completes* —
 * not merely when the request succeeds — so a resolved write really is durable.
 */
async function runInStore<T>(
  // Spelled out rather than IDBTransactionMode: that name is a type, not a runtime global,
  // so eslint's browser environment does not know it and no-undef objects.
  mode: 'readonly' | 'readwrite',
  makeRequest: (store: IDBObjectStore) => IDBRequest,
): Promise<T> {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(kDocStore, mode);
    const request = makeRequest(tx.objectStore(kDocStore));
    let result: T;
    request.onsuccess = () => {
      result = request.result as T;
    };
    tx.oncomplete = () => resolve(result);
    tx.onerror = () =>
      reject(tx.error ?? request.error ?? new Error('Database request failed.'));
    tx.onabort = () =>
      reject(tx.error ?? request.error ?? new Error('Database write was aborted.'));
  });
}

export function putDocRecord(doc: unknown): Promise<void> {
  return runInStore('readwrite', (store) => store.put(doc));
}

export function getDocRecord<T>(id: string): Promise<T | undefined> {
  return runInStore<T | undefined>('readonly', (store) => store.get(id));
}

export function deleteDocRecord(id: string): Promise<void> {
  return runInStore('readwrite', (store) => store.delete(id));
}

export function getAllDocIds(): Promise<string[]> {
  return runInStore<string[]>('readonly', (store) => store.getAllKeys()).then((keys) =>
    (keys ?? []).map(String),
  );
}
