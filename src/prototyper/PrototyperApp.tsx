import { css } from '@emotion/react';
import {
  Button,
  Divider,
  FormControlLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ConfigrValues } from '../../lib/ContentPane';
import {
  blobToStoredImage,
  imageFromClipboardEvent,
  isTextEntry,
  readImageFromClipboard,
} from './images';
import { Inspector } from './Inspector';
import {
  defaultNodeFor,
  deriveInitialValues,
  mergeLiveValues,
  newDocument,
  pathToNode,
  ProtoDocument,
  ProtoNode,
} from './model';
import { OutlineTree } from './OutlineTree';
import { Palette } from './Palette';
import {
  downloadDoc,
  loadInitialDoc,
  readDoc,
  readDocFromFile,
  readIndex,
  saveDocDebounced,
  seedDocument,
  setSaveErrorHandler,
} from './persistence';
import { PaneRenderer, SelectionContext } from './render';
import { usePrototyperStore } from './store';

/**
 * Which top-level page the pane should be showing: the one containing the selection.
 * Passing this back on every remount is what keeps the visible page from jumping to the
 * first one, since ConfigrPane only reads it in a useState initializer.
 */
function topLevelPageIdFor(root: ProtoNode, selectedId: string): string | undefined {
  const chain = pathToNode(root, selectedId);
  for (let i = 0; i < chain.length; i++) {
    const node = chain[i];
    if (node.type !== 'page') continue;
    const parent = chain[i - 1];
    if (!parent || parent.type === 'pane' || parent.type === 'area') return node.id;
  }
  return undefined;
}

// Sentinel values for the action items at the bottom of the document selector. Real
// documents are keyed by uuid, so these can never collide.
const kNewDoc = '__new__';
const kDuplicateDoc = '__duplicate__';
const kLoadSeed = '__seed__';

/**
 * Keep selector rows tellable-apart: if a document with this name already exists,
 * append the first free numeric suffix ("Bloom Collection Settings 2").
 *
 * `alsoTaken` is for the document currently open, whose first save may still be sitting
 * on the debounce and so may not have reached the index yet.
 */
function uniquifyName(name: string, alsoTaken: string[] = []): string {
  const taken = new Set([...readIndex().map((e) => e.name), ...alsoTaken]);
  if (!taken.has(name)) return name;
  for (let n = 2; ; n++) {
    const candidate = `${name} ${n}`;
    if (!taken.has(candidate)) return candidate;
  }
}

/**
 * Loading the first document is async now that documents live in IndexedDB, and hooks
 * cannot be called conditionally, so the wait lives in its own component and the editor
 * below only ever runs with a document in hand.
 */
export const PrototyperApp: React.FunctionComponent = () => {
  const [initialDoc, setInitialDoc] = useState<ProtoDocument | undefined>();
  const [loadError, setLoadError] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const doc = await loadInitialDoc();
        if (!cancelled) setInitialDoc(doc);
      } catch (err) {
        console.error('prototyper: could not load a document to start with', err);
        if (!cancelled) {
          // Still give them a usable editor rather than a dead page.
          setLoadError('Could not open stored prototypes. Starting from the Bloom seed.');
          setInitialDoc(seedDocument());
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!initialDoc) {
    return (
      <Typography
        variant="body1"
        css={css`
          padding: 24px;
          color: #666;
          font-family: sans-serif;
        `}
      >
        Opening your prototypes…
      </Typography>
    );
  }
  return <Editor initialDoc={initialDoc} initialError={loadError} />;
};

const Editor: React.FunctionComponent<{
  initialDoc: ProtoDocument;
  initialError?: string;
}> = ({ initialDoc, initialError }) => {
  const { state, actions, selectedNode, canInsert } = usePrototyperStore(initialDoc);
  const { doc, selectedId, previewMode, showNotes } = state;
  const root = doc.root;

  // One place for anything the toolbar needs to tell the user: a bad upload, a clipboard
  // that had no image, or a save that failed.
  const [toolbarError, setToolbarError] = useState<string | undefined>(initialError);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [docIndex, setDocIndex] = useState(readIndex);

  // Autosave runs on a debounce with nobody watching it, so route its failures here.
  useEffect(() => {
    setSaveErrorHandler(setToolbarError);
    return () => setSaveErrorHandler(undefined);
  }, []);

  // ContentPane calls onChange during render, so this handler must never call setState.
  const liveValuesRef = useRef<ConfigrValues>(deriveInitialValues(root));

  /**
   * Swap to another document. The debounce keeps only its latest pending call, so without
   * the flush an edit made in the last half-second before switching would be lost.
   */
  const switchToDoc = (next: ProtoDocument) => {
    saveDocDebounced.flush();
    liveValuesRef.current = deriveInitialValues(next.root);
    focussedPageKeyRef.current = undefined;
    actions.loadDoc(next);
  };

  useEffect(() => {
    saveDocDebounced(doc);
  }, [doc]);

  /**
   * The pane remounts only when the set of paths and defaults changes, because Formik is
   * built without enableReinitialize. Keying on the values signature rather than on every
   * edit means label and description edits re-render in place instead of remounting (which
   * would drop nested-page focus and scroll on each keystroke).
   */
  const valuesSignature = useMemo(
    () => JSON.stringify(deriveInitialValues(root)),
    [root],
  );

  // Typed-in values survive a remount, but paths that no longer exist do not come back.
  const initialValues = useMemo(
    () => mergeLiveValues(root, liveValuesRef.current),
    [root],
  );

  const lastPageIdRef = useRef<string | undefined>(undefined);
  const pageId = topLevelPageIdFor(root, selectedId);
  if (pageId) lastPageIdRef.current = pageId;

  // Which page (possibly a nested one) the pane is showing right now, reported by the
  // library. Handing it back on remount is what keeps an edit made while inside a subpage
  // from dumping the user out to the top-level page.
  const focussedPageKeyRef = useRef<string | undefined>(undefined);

  const selectionContext = useMemo(
    () => ({ selectedId, select: actions.select, previewMode, showNotes }),
    [selectedId, actions.select, previewMode, showNotes],
  );

  /** Scale and encode a clipboard image, reporting anything that goes wrong. */
  const storeImage = useCallback(async (blob: Blob) => {
    try {
      return await blobToStoredImage(blob);
    } catch (err) {
      setToolbarError(err instanceof Error ? err.message : 'Could not read that image.');
      return undefined;
    }
  }, []);

  const insertImageBlob = useCallback(
    async (blob: Blob) => {
      // Nothing can hold an image when the pane itself is selected, and a paste that
      // silently did nothing would look like the feature was broken.
      if (!canInsert('image')) {
        setToolbarError('Select a page or a group first, then paste the screenshot.');
        return;
      }
      const imageData = await storeImage(blob);
      if (!imageData) return;
      setToolbarError(undefined);
      actions.insertPrepared({ ...defaultNodeFor('image'), imageData });
    },
    [actions, canInsert, storeImage],
  );

  const insertImageFromClipboard = useCallback(async () => {
    const { blob, error } = await readImageFromClipboard();
    if (!blob) {
      setToolbarError(error);
      return;
    }
    await insertImageBlob(blob);
  }, [insertImageBlob]);

  const replaceImageFromClipboard = useCallback(
    async (nodeId: string) => {
      const { blob, error } = await readImageFromClipboard();
      if (!blob) {
        setToolbarError(error);
        return;
      }
      const imageData = await storeImage(blob);
      if (!imageData) return;
      setToolbarError(undefined);
      actions.updateProps(nodeId, { imageData });
    },
    [actions, storeImage],
  );

  /**
   * Paste a screenshot straight onto the canvas. Ignored while typing into a field, so
   * pasting text into the inspector still works, and off entirely in preview mode.
   */
  useEffect(() => {
    if (previewMode) return;
    const onPaste = (event: ClipboardEvent) => {
      if (isTextEntry(event.target)) return;
      const blob = imageFromClipboardEvent(event);
      if (!blob) return;
      event.preventDefault();
      void insertImageBlob(blob);
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [previewMode, insertImageBlob]);

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        height: 100vh;
        overflow: hidden;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
          Arial, sans-serif;
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 6px 10px;
          background-color: #2d3b45;
          color: white;
          flex-shrink: 0;
        `}
      >
        <Typography variant="subtitle2">Configr Prototyper</Typography>
        <TextField
          size="small"
          variant="standard"
          value={doc.name}
          onChange={(e) => actions.rename(e.target.value)}
          css={css`
            input {
              color: white;
              font-size: 13px;
            }
            .MuiInput-root:before {
              border-bottom-color: rgba(255, 255, 255, 0.4);
            }
          `}
        />
        <Select
          size="small"
          variant="standard"
          value={doc.id}
          onOpen={() => setDocIndex(readIndex())}
          onChange={(e) => {
            switch (e.target.value) {
              case doc.id:
                return;
              case kNewDoc: {
                const blank = newDocument();
                switchToDoc({ ...blank, name: uniquifyName(blank.name, [doc.name]) });
                return;
              }
              case kDuplicateDoc:
                switchToDoc({
                  ...JSON.parse(JSON.stringify(doc)),
                  id: crypto.randomUUID(),
                  name: uniquifyName(`${doc.name} (copy)`, [doc.name]),
                });
                return;
              case kLoadSeed: {
                // A fresh id each time, so the seed never overwrites an edited copy.
                const seed = seedDocument();
                switchToDoc({
                  ...seed,
                  id: crypto.randomUUID(),
                  name: uniquifyName(seed.name, [doc.name]),
                });
                return;
              }
              default: {
                // Reading from IndexedDB is async, but the flush inside switchToDoc still
                // captures the outgoing document: the debounce holds its arguments, and
                // nothing can edit it while we wait.
                const chosenId = e.target.value;
                void (async () => {
                  const chosen = await readDoc(chosenId);
                  if (chosen) switchToDoc(chosen);
                  else setToolbarError('Could not open that prototype.');
                })();
              }
            }
          }}
          css={css`
            color: white;
            font-size: 13px;
            .MuiSelect-icon {
              color: rgba(255, 255, 255, 0.7);
            }
            :before {
              border-bottom-color: rgba(255, 255, 255, 0.4);
            }
          `}
        >
          {/* The current doc may not be in the index yet (first save is debounced). */}
          {!docIndex.some((e) => e.id === doc.id) && (
            <MenuItem value={doc.id}>{doc.name}</MenuItem>
          )}
          {docIndex.map((e) => (
            <MenuItem key={e.id} value={e.id}>
              {e.name}
            </MenuItem>
          ))}
          <Divider />
          <MenuItem value={kNewDoc}>New prototype</MenuItem>
          <MenuItem value={kDuplicateDoc}>Duplicate current</MenuItem>
          <MenuItem value={kLoadSeed}>Load Bloom seed</MenuItem>
        </Select>
        <ToolbarButton onClick={() => downloadDoc(doc)}>Download JSON</ToolbarButton>
        <ToolbarButton onClick={() => fileInputRef.current?.click()}>
          Upload JSON
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = '';
            if (!file) return;
            const { doc: uploaded, error } = await readDocFromFile(file);
            setToolbarError(error);
            if (uploaded) switchToDoc(uploaded);
          }}
        />
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={showNotes}
              disabled={previewMode}
              onChange={(e) => actions.setShowNotes(e.target.checked)}
            />
          }
          label={<Typography variant="body2">Notes</Typography>}
        />
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={previewMode}
              onChange={(e) => actions.setPreview(e.target.checked)}
            />
          }
          label={<Typography variant="body2">Preview</Typography>}
        />
        {toolbarError && (
          <Typography
            variant="body2"
            onClick={() => setToolbarError(undefined)}
            title="Click to dismiss"
            css={css`
              color: #ffb4a9;
              cursor: default;
            `}
          >
            {toolbarError}
          </Typography>
        )}
      </div>

      <div
        css={css`
          display: flex;
          flex: 1;
          min-height: 0;
        `}
      >
        {!previewMode && (
          <div
            css={css`
              width: 260px;
              flex-shrink: 0;
              display: flex;
              flex-direction: column;
              border-right: 1px solid #ddd;
              min-height: 0;
            `}
          >
            <Palette
              canInsert={canInsert}
              insert={actions.insert}
              insertImageFromClipboard={insertImageFromClipboard}
            />
            <OutlineTree root={root} selectedId={selectedId} select={actions.select} />
          </div>
        )}

        <div
          css={css`
            flex: 1;
            min-width: 0;
            overflow: auto;
            padding: 16px;
            background-color: #eef1f4;
          `}
        >
          <SelectionContext.Provider value={selectionContext}>
            <PaneRenderer
              key={valuesSignature}
              root={root}
              initialValues={initialValues}
              onChange={(values) => (liveValuesRef.current = values)}
              initiallySelectedTopLevelPageKey={lastPageIdRef.current}
              initiallyFocussedPageKey={focussedPageKeyRef.current}
              onFocussedPageKeyChanged={(pageKey) =>
                (focussedPageKeyRef.current = pageKey)
              }
              previewMode={previewMode}
            />
          </SelectionContext.Provider>
        </div>

        {!previewMode && (
          <div
            css={css`
              width: 320px;
              flex-shrink: 0;
              border-left: 1px solid #ddd;
              display: flex;
              flex-direction: column;
              min-height: 0;
            `}
          >
            <Inspector
              node={selectedNode}
              isRoot={selectedId === root.id}
              actions={actions}
              replaceImageFromClipboard={replaceImageFromClipboard}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const ToolbarButton: React.FunctionComponent<
  React.PropsWithChildren<{ onClick: () => void }>
> = (props) => (
  <Button
    size="small"
    onClick={props.onClick}
    css={css`
      color: white;
      text-transform: none;
      white-space: nowrap;
    `}
  >
    {props.children}
  </Button>
);
