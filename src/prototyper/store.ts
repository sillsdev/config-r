// The editor's state: one document, the current selection, and the preview toggle.
import { useCallback, useMemo, useReducer } from 'react';

import {
  canContain,
  cloneWithNewIds,
  collectPaths,
  defaultNodeFor,
  derivePath,
  findNode,
  findParent,
  insertNode,
  moveNode,
  NodeType,
  ProtoDocument,
  ProtoNode,
  removeNode,
  updateNodeProps,
  valueLeafTypes,
} from './model';

export interface ProtoState {
  doc: ProtoDocument;
  selectedId: string;
  previewMode: boolean;
  showNotes: boolean;
}

type Action =
  | { kind: 'loadDoc'; doc: ProtoDocument }
  | { kind: 'rename'; name: string }
  | { kind: 'select'; id: string }
  | { kind: 'insert'; type: NodeType }
  | { kind: 'insertPrepared'; node: ProtoNode }
  | { kind: 'updateProps'; id: string; partial: Partial<ProtoNode> }
  | { kind: 'move'; id: string; delta: number }
  | { kind: 'remove'; id: string }
  | { kind: 'duplicate'; id: string }
  | { kind: 'setPreview'; on: boolean }
  | { kind: 'setShowNotes'; on: boolean };

/**
 * Where a new node of `type` should go, given the selection: into the selection if it can
 * hold one, else into the nearest ancestor that can, immediately after the selection's
 * subtree. That is what makes "select a checkbox, click Boolean" append a sibling row.
 */
export function findInsertionPoint(
  root: ProtoNode,
  selectedId: string,
  type: NodeType,
): { parentId: string; index?: number } | undefined {
  let node = findNode(root, selectedId) ?? root;
  if (canContain(node.type, type)) return { parentId: node.id };
  for (;;) {
    const parent = findParent(root, node.id);
    if (!parent) return undefined;
    if (canContain(parent.type, type)) {
      const index = (parent.children ?? []).findIndex((c) => c.id === node.id);
      return { parentId: parent.id, index: index < 0 ? undefined : index + 1 };
    }
    node = parent;
  }
}

function reduce(state: ProtoState, action: Action): ProtoState {
  const { doc } = state;
  const withRoot = (root: ProtoNode, selectedId = state.selectedId): ProtoState =>
    root === doc.root && selectedId === state.selectedId
      ? state
      : { ...state, doc: { ...doc, root }, selectedId };

  switch (action.kind) {
    case 'loadDoc':
      return { ...state, doc: action.doc, selectedId: action.doc.root.id };

    case 'rename':
      return { ...state, doc: { ...doc, name: action.name } };

    case 'select':
      return { ...state, selectedId: action.id };

    case 'insert': {
      const where = findInsertionPoint(doc.root, state.selectedId, action.type);
      if (!where) return state;
      const node = defaultNodeFor(action.type);
      if (valueLeafTypes.includes(node.type)) {
        node.path = derivePath(node.label ?? node.type, new Set(collectPaths(doc.root)));
      }
      return withRoot(insertNode(doc.root, where.parentId, node, where.index), node.id);
    }

    /** Same placement rules as the palette, but for a node that already carries data. */
    case 'insertPrepared': {
      const where = findInsertionPoint(doc.root, state.selectedId, action.node.type);
      if (!where) return state;
      return withRoot(
        insertNode(doc.root, where.parentId, action.node, where.index),
        action.node.id,
      );
    }

    case 'updateProps':
      return withRoot(updateNodeProps(doc.root, action.id, action.partial));

    case 'move':
      return withRoot(moveNode(doc.root, action.id, action.delta));

    case 'remove': {
      if (action.id === doc.root.id) return state;
      const parent = findParent(doc.root, action.id);
      return withRoot(removeNode(doc.root, action.id), parent?.id ?? doc.root.id);
    }

    case 'duplicate': {
      const node = findNode(doc.root, action.id);
      const parent = node && findParent(doc.root, action.id);
      if (!node || !parent) return state;
      const copy = cloneWithNewIds(node);
      // Give the copy's value-carrying leaves fresh paths so they do not share values.
      const taken = new Set(collectPaths(doc.root));
      const repath = (n: ProtoNode) => {
        if (valueLeafTypes.includes(n.type) && n.path) {
          n.path = derivePath(n.path, taken);
          taken.add(n.path);
        }
        (n.children ?? []).forEach(repath);
      };
      repath(copy);
      const index = (parent.children ?? []).findIndex((c) => c.id === action.id);
      return withRoot(insertNode(doc.root, parent.id, copy, index + 1), copy.id);
    }

    case 'setPreview':
      return { ...state, previewMode: action.on };

    case 'setShowNotes':
      return { ...state, showNotes: action.on };
  }
}

export function usePrototyperStore(initialDoc: ProtoDocument) {
  const [state, dispatch] = useReducer(reduce, undefined, () => ({
    doc: initialDoc,
    selectedId: initialDoc.root.id,
    previewMode: false,
    showNotes: true,
  }));

  const actions = useMemo(
    () => ({
      loadDoc: (doc: ProtoDocument) => dispatch({ kind: 'loadDoc', doc }),
      rename: (name: string) => dispatch({ kind: 'rename', name }),
      select: (id: string) => dispatch({ kind: 'select', id }),
      insert: (type: NodeType) => dispatch({ kind: 'insert', type }),
      insertPrepared: (node: ProtoNode) => dispatch({ kind: 'insertPrepared', node }),
      updateProps: (id: string, partial: Partial<ProtoNode>) =>
        dispatch({ kind: 'updateProps', id, partial }),
      move: (id: string, delta: number) => dispatch({ kind: 'move', id, delta }),
      remove: (id: string) => dispatch({ kind: 'remove', id }),
      duplicate: (id: string) => dispatch({ kind: 'duplicate', id }),
      setPreview: (on: boolean) => dispatch({ kind: 'setPreview', on }),
      setShowNotes: (on: boolean) => dispatch({ kind: 'setShowNotes', on }),
    }),
    [],
  );

  const selectedNode = useMemo(
    () => findNode(state.doc.root, state.selectedId),
    [state.doc.root, state.selectedId],
  );

  const canInsert = useCallback(
    (type: NodeType) => !!findInsertionPoint(state.doc.root, state.selectedId, type),
    [state.doc.root, state.selectedId],
  );

  return { state, actions, selectedNode, canInsert };
}

export type ProtoActions = ReturnType<typeof usePrototyperStore>['actions'];
