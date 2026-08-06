// Where documents live: IndexedDB for the documents themselves, localStorage for the tiny
// index and last-open id. JSON files are still the durable backup; this is the convenience
// layer that lets you close the tab and come back.
//
// Documents started out in localStorage, but a couple of pasted screenshots exhaust its
// ~5MB shared quota. Anything already saved there is migrated on startup and removed, which
// also hands that quota back.
import debounce from 'lodash/debounce';

import { deleteDocRecord, getAllDocIds, getDocRecord, putDocRecord } from './db';
import { ProtoDocument, validateDocument } from './model';
// The checked-in seed is imported rather than duplicated in code, so the file the user can
// Upload and the document they get on first run cannot drift apart.
import bloomCollectionSeed from './seeds/bloom-collection.json';

const kPrefix = 'configr-proto/';
const kIndexKey = `${kPrefix}index`;
const kLastOpenKey = `${kPrefix}lastOpen`;

export type DocIndexEntry = { id: string; name: string; modified: string };

function readJson<T>(key: string): T | undefined {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Synchronous on purpose: the toolbar's document picker reads this while rendering, and the
 * entries are a few dozen bytes each.
 */
export function readIndex(): DocIndexEntry[] {
  return readJson<DocIndexEntry[]>(kIndexKey) ?? [];
}

function writeIndexEntry(entry: DocIndexEntry) {
  const rest = readIndex().filter((e) => e.id !== entry.id);
  localStorage.setItem(kIndexKey, JSON.stringify([entry, ...rest]));
}

export async function readDoc(id: string): Promise<ProtoDocument | undefined> {
  try {
    const doc = await getDocRecord<ProtoDocument>(id);
    return doc && !validateDocument(doc) ? doc : undefined;
  } catch (err) {
    console.error('prototyper: could not read document', id, err);
    return undefined;
  }
}

/**
 * Where a failed save gets reported. Autosave happens on a debounce with nobody watching,
 * so without this a failure would only ever show up in the console — and the user would
 * keep working, believing their pasted screenshots were saved.
 */
let saveErrorHandler: ((message: string | undefined) => void) | undefined;

export function setSaveErrorHandler(
  handler: ((message: string | undefined) => void) | undefined,
) {
  saveErrorHandler = handler;
}

function isQuotaError(err: unknown): boolean {
  return (
    err instanceof DOMException &&
    (err.name === 'QuotaExceededError' ||
      err.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      err.code === 22)
  );
}

export async function saveDoc(doc: ProtoDocument) {
  const stamped: ProtoDocument = { ...doc, modified: new Date().toISOString() };
  try {
    // The document goes in first, so the index can never advertise something that is not
    // actually stored.
    await putDocRecord(stamped);
    localStorage.setItem(kLastOpenKey, stamped.id);
    writeIndexEntry({
      id: stamped.id,
      name: stamped.name,
      modified: stamped.modified,
    });
  } catch (err) {
    console.error('prototyper: could not save the document', err);
    saveErrorHandler?.(
      isQuotaError(err)
        ? 'Out of browser storage, so this is NOT saved. Download JSON now, then delete some images.'
        : 'Could not save to browser storage, so this is NOT saved. Download JSON to be safe.',
    );
  }
}

/**
 * Debounced so typing in the inspector does not hammer the database. `flush()` still runs
 * the pending call immediately, which is what makes switching documents safe.
 */
export const saveDocDebounced = debounce(saveDoc, 500);

/**
 * A fresh copy of the Bloom Collection Settings mockup. Cloned every time so edits never
 * reach back into the imported module object.
 */
export function seedDocument(): ProtoDocument {
  return JSON.parse(JSON.stringify(bloomCollectionSeed)) as ProtoDocument;
}

/**
 * Copy any documents still sitting in localStorage into IndexedDB and delete them there,
 * restoring both the prototypes and the localStorage headroom. Returns how many moved.
 */
export async function migrateLocalStorageDocs(): Promise<number> {
  const docKeys = Object.keys(localStorage).filter(
    (key) => key.startsWith(kPrefix) && key !== kIndexKey && key !== kLastOpenKey,
  );
  let moved = 0;
  for (const key of docKeys) {
    const doc = readJson<ProtoDocument>(key);
    if (!doc || validateDocument(doc)) {
      // Not a usable document. Leave it be rather than throwing data away silently.
      console.warn('prototyper: leaving unrecognized localStorage entry alone', key);
      continue;
    }
    try {
      await putDocRecord(doc);
      localStorage.removeItem(key);
      // The old code kept the index in step, but repair it if this one is missing.
      if (!readIndex().some((e) => e.id === doc.id)) {
        writeIndexEntry({ id: doc.id, name: doc.name, modified: doc.modified });
      }
      moved++;
    } catch (err) {
      console.error('prototyper: could not migrate', key, err);
    }
  }
  return moved;
}

/**
 * Startup: migrate anything left in localStorage, then open the last document, falling back
 * to any document we can find and finally to the Bloom seed.
 */
export async function loadInitialDoc(): Promise<ProtoDocument> {
  await migrateLocalStorageDocs();

  const lastOpen = localStorage.getItem(kLastOpenKey);
  const lastDoc = lastOpen ? await readDoc(lastOpen) : undefined;
  if (lastDoc) return lastDoc;

  for (const entry of readIndex()) {
    const fromIndex = await readDoc(entry.id);
    if (fromIndex) return fromIndex;
  }

  // The index can fall out of step with the store (someone clears localStorage, say), so
  // ask the database itself before giving up and handing back a fresh seed.
  try {
    for (const id of await getAllDocIds()) {
      const orphan = await readDoc(id);
      if (orphan) {
        writeIndexEntry({
          id: orphan.id,
          name: orphan.name,
          modified: orphan.modified,
        });
        return orphan;
      }
    }
  } catch (err) {
    console.error('prototyper: could not list stored documents', err);
  }

  return seedDocument();
}

export async function deleteDoc(id: string) {
  try {
    await deleteDocRecord(id);
  } catch (err) {
    console.error('prototyper: could not delete document', id, err);
  }
  localStorage.setItem(kIndexKey, JSON.stringify(readIndex().filter((e) => e.id !== id)));
}

export function downloadDoc(doc: ProtoDocument) {
  const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${doc.name.replace(/[^\w.-]+/g, '-') || 'mockup'}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Parse an uploaded file. Resolves with a document or a plain error message. */
export async function readDocFromFile(
  file: File,
): Promise<{ doc?: ProtoDocument; error?: string }> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(await file.text());
  } catch {
    return { error: `${file.name} is not valid JSON.` };
  }
  const error = validateDocument(parsed);
  if (error) return { error: `${file.name}: ${error}` };
  return { doc: parsed as ProtoDocument };
}
