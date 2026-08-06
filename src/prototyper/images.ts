// Getting a pasted screenshot into a document, small enough to live in localStorage.
//
// Images are stored as data URLs on the node, so they persist and travel inside Download
// JSON with no separate asset handling. The cost is localStorage's few-megabyte quota, so
// anything oversized gets scaled and re-encoded before it is stored.

/** Screenshots wider than this are scaled down; 1600px is plenty for a mockup. */
const kMaxWidth = 1600;

/**
 * Above this many characters of data URL we re-encode rather than store the original, and
 * try JPEG as well as PNG. Roughly 400KB of image, which keeps a handful of screenshots
 * comfortably inside the quota.
 */
const kReencodeAbove = 550_000;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error('That does not look like an image we can read.'));
    img.src = src;
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Could not read that image.'));
    reader.readAsDataURL(blob);
  });
}

/**
 * A data URL ready to store: the original bytes when they are already small enough,
 * otherwise scaled to kMaxWidth and re-encoded as whichever of PNG or JPEG comes out
 * smaller. Screenshots are usually PNG, and PNG keeps text crisp, so it is preferred
 * unless it is clearly the bigger of the two.
 */
export async function blobToStoredImage(blob: Blob): Promise<string> {
  const original = await blobToDataUrl(blob);
  const img = await loadImage(original);
  const scale = img.naturalWidth > kMaxWidth ? kMaxWidth / img.naturalWidth : 1;
  if (scale === 1 && original.length <= kReencodeAbove) return original;

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) return original;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const png = canvas.toDataURL('image/png');
  if (png.length <= kReencodeAbove) return png;
  const jpeg = canvas.toDataURL('image/jpeg', 0.85);
  return jpeg.length < png.length ? jpeg : png;
}

/** Roughly what this data URL costs in localStorage, in KB. */
export function approximateStoredKB(dataUrl: string | undefined): number {
  if (!dataUrl) return 0;
  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1);
  return Math.round((base64.length * 3) / 4 / 1024);
}

/** The first image on a paste event's clipboard, if any. */
export function imageFromClipboardEvent(event: ClipboardEvent): Blob | undefined {
  const items = event.clipboardData?.items;
  if (!items) return undefined;
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.startsWith('image/')) {
      const file = items[i].getAsFile();
      if (file) return file;
    }
  }
  return undefined;
}

/**
 * How long to wait for navigator.clipboard.read() before giving up on it.
 *
 * This is not belt-and-braces: when the clipboard-read permission is in its default
 * "prompt" state and Chrome cannot show the prompt (or the user simply ignores it), the
 * promise never settles at all. Without a timeout the button would sit there doing nothing,
 * reporting neither an image nor an error.
 */
const kClipboardTimeoutMs = 3000;

/**
 * Ask the clipboard for an image, for the palette and Replace buttons. Chrome may refuse
 * or stall depending on permission and user gesture, so every failure comes back as advice
 * to press Ctrl+V instead, which goes through the paste handler and always works.
 */
export async function readImageFromClipboard(): Promise<{
  blob?: Blob;
  error?: string;
}> {
  const kPasteInstead = 'Click the canvas and press Ctrl+V instead.';
  if (!navigator.clipboard?.read) {
    return { error: `This browser will not hand over the clipboard. ${kPasteInstead}` };
  }
  let timer: number | undefined;
  try {
    const items = await Promise.race([
      navigator.clipboard.read(),
      new Promise<null>((resolve) => {
        timer = window.setTimeout(() => resolve(null), kClipboardTimeoutMs);
      }),
    ]);
    if (!items) {
      return { error: `Chrome did not release the clipboard. ${kPasteInstead}` };
    }
    for (const item of items) {
      const type = item.types.find((t) => t.startsWith('image/'));
      if (type) return { blob: await item.getType(type) };
    }
    return {
      error: 'The clipboard has no image in it. Copy a screenshot, then try again.',
    };
  } catch {
    return { error: `Chrome would not let us read the clipboard. ${kPasteInstead}` };
  } finally {
    if (timer !== undefined) window.clearTimeout(timer);
  }
}

/** True when a paste is landing in something the user is typing into. */
export function isTextEntry(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el || !el.tagName) return false;
  return (
    el.tagName === 'INPUT' ||
    el.tagName === 'TEXTAREA' ||
    el.tagName === 'SELECT' ||
    el.isContentEditable === true
  );
}
