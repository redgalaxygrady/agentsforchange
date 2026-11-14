/**
 * Screenshots of the learner's work stay in this browser.
 * IndexedDB is used because images quickly outgrow localStorage's small quota.
 */
const DB_NAME = 'agents-for-change';
const STORE = 'version-images';
const MAX_SIDE = 1600;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!globalThis.indexedDB) { reject(new Error('IndexedDB unavailable')); return; }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => { request.result.createObjectStore(STORE); };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB failed'));
    request.onblocked = () => reject(new Error('IndexedDB blocked'));
  });
}

async function withStore<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();
  try {
    return await new Promise<T>((resolve, reject) => {
      const transaction = db.transaction(STORE, mode);
      const request = run(transaction.objectStore(STORE));
      transaction.oncomplete = () => resolve(request.result);
      transaction.onerror = () => reject(transaction.error ?? new Error('IndexedDB transaction failed'));
      transaction.onabort = () => reject(transaction.error ?? new Error('IndexedDB transaction aborted'));
    });
  } finally {
    db.close();
  }
}

export async function putImage(id: string, blob: Blob): Promise<void> {
  await withStore('readwrite', (store) => store.put(blob, id));
}

export async function getImage(id: string): Promise<Blob | null> {
  const result = await withStore<unknown>('readonly', (store) => store.get(id));
  return result instanceof Blob ? result : null;
}

export async function deleteImage(id: string): Promise<void> {
  await withStore('readwrite', (store) => store.delete(id));
}

/** Shrink large photos and screenshots so a handful of versions stays light. */
export async function prepareImage(file: Blob): Promise<Blob> {
  if (!file.type.startsWith('image/')) throw new Error('Not an image');
  let bitmap: ImageBitmap;
  try { bitmap = await createImageBitmap(file); }
  catch { throw new Error('Unreadable image'); }
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size < 900_000) { bitmap.close(); return file; }
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext('2d');
  if (!context) { bitmap.close(); return file; }
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.86));
  return blob ?? file;
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error('Could not read image'));
    reader.readAsDataURL(blob);
  });
}
