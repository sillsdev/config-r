// The prototyper's document model: a JSON-serializable tree of nodes that the renderer
// turns into real Configr components. Everything here is pure and non-mutating, so the
// reducer stays trivial and a future undo stack is just an array of past roots.
import camelCase from 'lodash/camelCase';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import set from 'lodash/set';

export type NodeType =
  | 'pane'
  | 'area'
  | 'page'
  | 'group'
  // leaves
  | 'input'
  | 'boolean'
  | 'select'
  | 'radioGroup'
  | 'static'
  | 'subpage'
  | 'custom'
  | 'image';

export type SelectOption = { value: string; label?: string; description?: string };

/**
 * One flat, mostly-optional shape rather than a discriminated union: the inspector and
 * the renderer both switch on `type` anyway, and a flat record keeps JSON round-tripping
 * and the reducer's generic `updateProps(id, partial)` simple.
 */
export interface ProtoNode {
  id: string;
  type: NodeType;
  label?: string;
  children?: ProtoNode[];
  /** A comment for the developer about behavior the mockup does not implement. */
  note?: string;

  // leaf fields
  path?: string;
  description?: string;
  disabled?: boolean;
  required?: boolean;
  defaultValue?: unknown;

  // input
  inputType?: 'text' | 'number' | 'email';
  units?: string;
  charactersWide?: number;

  // boolean
  immediateEffect?: boolean;
  locked?: boolean;

  // select / radioGroup
  options?: SelectOption[];
  row?: boolean;

  // static
  text?: string;

  // pane
  showSearch?: boolean;
  showJson?: boolean;

  // custom
  controlName?: string;
  customProps?: Record<string, unknown>;

  /**
   * image: the picture itself, as a data URL, so a pasted screenshot survives in
   * localStorage and travels inside Download JSON with no separate asset handling.
   */
  imageData?: string;
}

export interface ProtoDocument {
  formatVersion: 1;
  id: string;
  name: string;
  modified: string;
  root: ProtoNode;
}

export const kFormatVersion = 1;

/** Node types that hold a Formik value, and therefore need a `path`. */
export const valueLeafTypes: NodeType[] = ['input', 'boolean', 'select', 'radioGroup'];

const groupChildTypes: NodeType[] = [
  'input',
  'boolean',
  'select',
  'radioGroup',
  'static',
  'subpage',
  'custom',
  'image',
];

/**
 * A subpage is a nested ConfigrPage, and ConfigrPage identity-checks its children against
 * ConfigrGroup/ConfigrForEach/ConfigrStatic. So a page and a subpage hold the same things:
 * groups, plus statics and customs that the renderer wraps in a bare ConfigrStatic.
 */
const pageChildTypes: NodeType[] = ['group', 'static', 'custom', 'image'];

/**
 * The single source of truth for what may go where. Drives the palette, insertion, and
 * (later) paste validation.
 */
export const containment: Record<NodeType, NodeType[]> = {
  pane: ['area', 'page'],
  area: ['page'],
  page: pageChildTypes,
  subpage: pageChildTypes,
  group: groupChildTypes,
  input: [],
  boolean: [],
  select: [],
  radioGroup: [],
  static: [],
  custom: [],
  image: [],
};

/** Types the palette offers, in button order. */
export const paletteTypes: NodeType[] = [
  'area',
  'page',
  'group',
  'subpage',
  'input',
  'boolean',
  'select',
  'radioGroup',
  'static',
  'custom',
  'image',
];

export const typeLabels: Record<NodeType, string> = {
  pane: 'Pane',
  area: 'Area',
  page: 'Page',
  group: 'Group',
  input: 'Input',
  boolean: 'Boolean',
  select: 'Select',
  radioGroup: 'Radio Group',
  static: 'Static Text',
  subpage: 'Subpage',
  custom: 'Custom',
  image: 'Image',
};

export function canContain(parentType: NodeType, childType: NodeType): boolean {
  return containment[parentType].includes(childType);
}

export function isContainer(type: NodeType): boolean {
  return containment[type].length > 0;
}

export function newId(): string {
  return crypto.randomUUID();
}

export function defaultNodeFor(type: NodeType): ProtoNode {
  const node: ProtoNode = { id: newId(), type, label: typeLabels[type] };
  switch (type) {
    case 'pane':
      return { ...node, label: 'Settings', showSearch: true, children: [] };
    case 'area':
      return { ...node, label: 'New Area', children: [] };
    case 'page':
      return { ...node, label: 'New Page', children: [] };
    case 'group':
      return { ...node, label: 'New Group', children: [] };
    case 'subpage':
      return { ...node, label: 'New Subpage', children: [] };
    case 'input':
      return { ...node, label: 'New Input', inputType: 'text', defaultValue: '' };
    case 'boolean':
      return { ...node, label: 'New Checkbox', defaultValue: false };
    case 'select':
      return {
        ...node,
        label: 'New Select',
        options: [
          { value: 'one', label: 'One' },
          { value: 'two', label: 'Two' },
        ],
        defaultValue: 'one',
      };
    case 'radioGroup':
      return {
        ...node,
        label: 'New Radio Group',
        options: [
          { value: 'one', label: 'One' },
          { value: 'two', label: 'Two' },
        ],
        defaultValue: 'one',
      };
    case 'static':
      return { ...node, label: 'Static Text', text: 'Some explanatory text.' };
    case 'custom':
      return { ...node, label: 'Custom', controlName: '' };
    case 'image':
      return { ...node, label: 'Pasted image' };
  }
}

export function typeDefaultValue(type: NodeType): unknown {
  return type === 'boolean' ? false : '';
}

// ---------------------------------------------------------------------------
// Tree queries
// ---------------------------------------------------------------------------

export function findNode(root: ProtoNode, id: string): ProtoNode | undefined {
  if (root.id === id) return root;
  for (const child of root.children ?? []) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return undefined;
}

export function findParent(root: ProtoNode, id: string): ProtoNode | undefined {
  for (const child of root.children ?? []) {
    if (child.id === id) return root;
    const found = findParent(child, id);
    if (found) return found;
  }
  return undefined;
}

/** The chain of nodes from the root down to and including `id`, or [] if not found. */
export function pathToNode(root: ProtoNode, id: string): ProtoNode[] {
  if (root.id === id) return [root];
  for (const child of root.children ?? []) {
    const below = pathToNode(child, id);
    if (below.length) return [root, ...below];
  }
  return [];
}

/** Every node in the tree, in document order. */
export function flatten(root: ProtoNode): ProtoNode[] {
  return [root, ...(root.children ?? []).flatMap(flatten)];
}

// ---------------------------------------------------------------------------
// Tree edits (all return a new root; untouched subtrees are shared)
// ---------------------------------------------------------------------------

function mapNode(
  root: ProtoNode,
  id: string,
  fn: (node: ProtoNode) => ProtoNode,
): ProtoNode {
  if (root.id === id) return fn(root);
  if (!root.children) return root;
  let changed = false;
  const children = root.children.map((child) => {
    const next = mapNode(child, id, fn);
    if (next !== child) changed = true;
    return next;
  });
  return changed ? { ...root, children } : root;
}

export function updateNodeProps(
  root: ProtoNode,
  id: string,
  partial: Partial<ProtoNode>,
): ProtoNode {
  return mapNode(root, id, (node) => ({ ...node, ...partial }));
}

/** Insert `node` into `parentId` at `index` (default: append). */
export function insertNode(
  root: ProtoNode,
  parentId: string,
  node: ProtoNode,
  index?: number,
): ProtoNode {
  return mapNode(root, parentId, (parent) => {
    const children = [...(parent.children ?? [])];
    children.splice(index ?? children.length, 0, node);
    return { ...parent, children };
  });
}

export function removeNode(root: ProtoNode, id: string): ProtoNode {
  if (root.id === id) return root; // never remove the root
  const parent = findParent(root, id);
  if (!parent) return root;
  return mapNode(root, parent.id, (p) => ({
    ...p,
    children: (p.children ?? []).filter((c) => c.id !== id),
  }));
}

/** Move a node up (-1) or down (+1) among its siblings. */
export function moveNode(root: ProtoNode, id: string, delta: number): ProtoNode {
  const parent = findParent(root, id);
  if (!parent) return root;
  const siblings = parent.children ?? [];
  const from = siblings.findIndex((c) => c.id === id);
  const to = from + delta;
  if (from < 0 || to < 0 || to >= siblings.length) return root;
  const reordered = [...siblings];
  const [moved] = reordered.splice(from, 1);
  reordered.splice(to, 0, moved);
  return mapNode(root, parent.id, (p) => ({ ...p, children: reordered }));
}

/** Deep clone a subtree with fresh ids. */
export function cloneWithNewIds(node: ProtoNode): ProtoNode {
  const copy = cloneDeep(node);
  const reid = (n: ProtoNode) => {
    n.id = newId();
    (n.children ?? []).forEach(reid);
  };
  reid(copy);
  return copy;
}

// ---------------------------------------------------------------------------
// Paths and Formik values
// ---------------------------------------------------------------------------

/**
 * A camelCase path derived from the label, uniquified against paths already in use.
 * Paths are stable once created; renaming a label does not rewrite them.
 */
export function derivePath(label: string, taken: Set<string>): string {
  const base = camelCase(label) || 'field';
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}${n}`)) n++;
  return `${base}${n}`;
}

/** Every path in use by a value-carrying leaf. */
export function collectPaths(root: ProtoNode): string[] {
  return flatten(root)
    .filter((n) => valueLeafTypes.includes(n.type) && n.path)
    .map((n) => n.path as string);
}

/** The Formik `initialValues` object implied by the tree's leaves. */
export function deriveInitialValues(root: ProtoNode): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const node of flatten(root)) {
    if (!valueLeafTypes.includes(node.type) || !node.path) continue;
    const value = node.defaultValue ?? typeDefaultValue(node.type);
    set(values, node.path, value);
  }
  return values;
}

/**
 * Values to hand a freshly remounted pane: the derived defaults, overlaid with whatever
 * the user has typed into the live preview, but only for paths that still exist.
 */
export function mergeLiveValues(
  root: ProtoNode,
  live: Record<string, unknown> | undefined,
): Record<string, unknown> {
  const values = deriveInitialValues(root);
  if (!live) return values;
  for (const path of collectPaths(root)) {
    const typed = get(live, path);
    if (typed !== undefined) set(values, path, typed);
  }
  return values;
}

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------

export function newDocument(name = 'Untitled mockup'): ProtoDocument {
  const input = defaultNodeFor('input');
  input.label = 'Example setting';
  input.path = 'exampleSetting';
  const group = { ...defaultNodeFor('group'), label: 'First Group', children: [input] };
  const page = { ...defaultNodeFor('page'), label: 'First Page', children: [group] };
  const pane = { ...defaultNodeFor('pane'), children: [page] };
  return {
    formatVersion: kFormatVersion,
    id: newId(),
    name,
    modified: new Date().toISOString(),
    root: pane,
  };
}

/** Validate a parsed JSON object as a document. Returns an error message or undefined. */
export function validateDocument(candidate: unknown): string | undefined {
  if (!candidate || typeof candidate !== 'object') return 'Not a JSON object.';
  const doc = candidate as Partial<ProtoDocument>;
  if (doc.formatVersion !== kFormatVersion)
    return `Expected formatVersion ${kFormatVersion}, got ${String(doc.formatVersion)}.`;
  if (!doc.root || typeof doc.root !== 'object') return 'Document has no root node.';
  if (doc.root.type !== 'pane') return "The root node must be of type 'pane'.";
  return undefined;
}
