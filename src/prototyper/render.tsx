// Turns a ProtoNode tree into real Configr components.
//
// The one rule that shapes this file: the library identity-checks its children.
// ConfigrPane demands literal ConfigrArea/ConfigrPage elements, and ConfigrPage demands
// literal ConfigrGroup/ConfigrForEach/ConfigrStatic elements. So containers are emitted
// bare and are selected from the outline tree instead. Only leaf rows inside a group get
// the Selectable wrapper, because BoxOfRows clones group children without a type check.
import { css } from '@emotion/react';
import { Typography } from '@mui/material';
import * as React from 'react';
import { createContext, useContext, useMemo } from 'react';

import { ConfigrPane } from '../../lib/ConfigrPane';
import {
  ConfigrArea,
  ConfigrBoolean,
  ConfigrGroup,
  ConfigrInput,
  ConfigrPage,
  ConfigrRadio,
  ConfigrRadioGroup,
  ConfigrSelect,
  ConfigrStatic,
  ConfigrValues,
} from '../../lib/ContentPane';
import { customControls } from './customControls';
import { NodeType, ProtoNode } from './model';

export interface SelectionContextValue {
  selectedId: string;
  select: (id: string) => void;
  previewMode: boolean;
  showNotes: boolean;
}

export const SelectionContext = createContext<SelectionContextValue>({
  selectedId: '',
  select: () => {},
  previewMode: false,
  showNotes: true,
});

/**
 * A developer note shown as a Figma-style green sticky. Hidden in preview mode and when
 * the toolbar toggle is off, so a screenshot can be taken either way.
 */
const StickyNote: React.FunctionComponent<{ note: string }> = ({ note }) => {
  const { previewMode, showNotes } = useContext(SelectionContext);
  if (previewMode || !showNotes) return null;
  return (
    <div
      css={css`
        display: inline-block;
        margin: 2px 0 8px 24px;
        padding: 6px 10px;
        max-width: 260px;
        background-color: #b6f2a2;
        color: #24371c;
        font-size: 11px;
        line-height: 1.35;
        white-space: pre-wrap;
        transform: rotate(-2deg);
        box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.25);
      `}
    >
      {note}
    </div>
  );
};

/** Attaches a node's sticky note under its control, if it has one. */
const WithNote: React.FunctionComponent<React.PropsWithChildren<{ note?: string }>> = ({
  note,
  children,
}) => {
  if (!note) return <>{children}</>;
  return (
    <>
      {children}
      <StickyNote note={note} />
    </>
  );
};

/**
 * Click-to-select wrapper for a leaf row.
 *
 * `inFocussedPage` is injected by BoxOfRows's cloneElement; we accept it so React does not
 * put it on the DOM, and drop it because leaves read it from their own props anyway.
 * `onClickCapture` beats MUI controls that swallow clicks, and unlike `onClick` on a div it
 * does not trip jsx-a11y's click-events-have-key-events rule.
 */
export const Selectable: React.FunctionComponent<
  React.PropsWithChildren<{
    nodeId: string;
    inFocussedPage?: boolean;
  }>
> = ({ nodeId, inFocussedPage: _injectedAndDropped, children }) => {
  const { selectedId, select, previewMode } = useContext(SelectionContext);
  if (previewMode) return <>{children}</>;
  const selected = selectedId === nodeId;
  return (
    <div
      data-proto-id={nodeId}
      onClickCapture={(e) => {
        e.stopPropagation();
        select(nodeId);
      }}
      css={css`
        /* outline rather than border so selecting a row does not shift the layout */
        outline: ${selected ? '2px solid #1976d2' : '2px solid transparent'};
        outline-offset: -2px;
        border-radius: 3px;
        background-color: ${selected ? 'rgba(25, 118, 210, 0.06)' : 'transparent'};
        &:hover {
          outline-color: ${selected ? '#1976d2' : 'rgba(25, 118, 210, 0.35)'};
        }
      `}
    >
      {children}
    </div>
  );
};

const PlaceholderRow: React.FunctionComponent<{ message: string }> = ({ message }) => (
  <Typography
    variant="body2"
    css={css`
      margin: 4px 16px;
      padding: 6px 10px;
      color: #b3261e;
      border: 1px dashed #b3261e;
      border-radius: 3px;
    `}
  >
    {message}
  </Typography>
);

/** Options as the library wants them, tolerating a partly-typed options list. */
function optionsFor(node: ProtoNode) {
  const options = (node.options ?? []).filter((o) => o && o.value !== undefined);
  return options.length ? options : [{ value: '', label: '(no options)' }];
}

/** The bare control for a leaf, with no selection wrapper, note, or key. */
function renderLeafControl(node: ProtoNode): React.ReactElement {
  const common = {
    path: node.path || node.id,
    label: node.label ?? '',
    description: node.description,
    disabled: node.disabled,
    required: node.required,
  };
  switch (node.type) {
    case 'input':
      return (
        <ConfigrInput
          {...common}
          type={node.inputType ?? 'text'}
          units={node.units || undefined}
          charactersWide={node.charactersWide || undefined}
        />
      );
    case 'boolean':
      return (
        <ConfigrBoolean
          {...common}
          immediateEffect={node.immediateEffect}
          locked={node.locked}
        />
      );
    case 'select':
      return <ConfigrSelect {...common} options={optionsFor(node)} />;
    case 'radioGroup':
      return (
        <ConfigrRadioGroup {...common} row={node.row}>
          {optionsFor(node).map((o) => (
            <ConfigrRadio key={o.value} value={o.value} label={o.label ?? o.value} />
          ))}
        </ConfigrRadioGroup>
      );
    case 'static':
      return (
        <ConfigrStatic>
          <Typography
            variant="body2"
            css={css`
              padding: 8px 16px;
              white-space: pre-wrap;
            `}
          >
            {node.text ?? ''}
          </Typography>
        </ConfigrStatic>
      );
    case 'image':
      if (!node.imageData) {
        return (
          <PlaceholderRow message="Image node with nothing in it yet. Select it and use Replace from clipboard, or just paste." />
        );
      }
      return (
        <div
          css={css`
            padding: 8px 16px;
          `}
        >
          <img
            src={node.imageData}
            alt={node.label || 'pasted screenshot'}
            css={css`
              display: block;
              /* Natural size, but never wider than the row. */
              max-width: 100%;
              height: auto;
              border: 1px solid #ddd;
            `}
          />
        </div>
      );

    case 'custom': {
      const Control = node.controlName ? customControls[node.controlName] : undefined;
      if (!Control) {
        return (
          <PlaceholderRow
            message={`Unknown custom control ${
              node.controlName ? `"${node.controlName}"` : '(none chosen)'
            }. Register it in src/prototyper/customControls.tsx.`}
          />
        );
      }
      return (
        <Control
          {...(node.customProps ?? {})}
          label={node.label}
          description={node.description}
        />
      );
    }
    default:
      return (
        <PlaceholderRow
          message={`Not rendered yet: ${node.type} "${node.label ?? ''}"`}
        />
      );
  }
}

/** True when the parent identity-checks its children, i.e. a page or a nested subpage. */
function parentChecksChildTypes(parentType: NodeType | undefined) {
  return parentType === 'page' || parentType === 'subpage';
}

/**
 * `parentType` is load-bearing. Under a page or subpage, a leaf must be a literal
 * ConfigrStatic so ConfigrPage's identity check passes, and so it cannot be wrapped for
 * selection; inside a group it gets the Selectable wrapper.
 */
export function renderNode(
  node: ProtoNode,
  parentType: NodeType | undefined,
): React.ReactElement {
  switch (node.type) {
    case 'area':
      return (
        <ConfigrArea key={node.id} label={node.label ?? ''}>
          {renderChildren(node)}
        </ConfigrArea>
      );

    case 'page':
    case 'subpage':
      // A subpage is emitted bare, never wrapped: BoxOfRows's non-focussed branch keeps
      // only children whose type is ConfigrPage/ConfigrForEach, so a wrapped nested page
      // would be filtered out and could never take focus. Select it from the outline.
      return (
        <ConfigrPage key={node.id} label={node.label ?? ''} pageKey={node.id}>
          {renderChildren(node)}
        </ConfigrPage>
      );

    case 'group':
      return (
        <ConfigrGroup
          key={node.id}
          label={node.label || undefined}
          description={node.description}
        >
          {renderChildren(node)}
        </ConfigrGroup>
      );

    default: {
      const control = <WithNote note={node.note}>{renderLeafControl(node)}</WithNote>;
      if (parentChecksChildTypes(parentType)) {
        // ConfigrStatic renders its children in a fragment, which makes it the one legal
        // way to put arbitrary content directly under a page.
        return <ConfigrStatic key={node.id}>{control}</ConfigrStatic>;
      }
      return (
        <Selectable key={node.id} nodeId={node.id}>
          {control}
        </Selectable>
      );
    }
  }
}

function renderChildren(node: ProtoNode): React.ReactElement[] {
  return (node.children ?? []).map((child) => renderNode(child, node.type));
}

/** ConfigrPane needs at least one page somewhere, or there is nothing for it to show. */
function hasAnyPage(node: ProtoNode): boolean {
  return (node.children ?? []).some(
    (child) => child.type === 'page' || hasAnyPage(child),
  );
}

export interface PaneRenderProps {
  root: ProtoNode;
  initialValues: ConfigrValues;
  /** Must only write to a ref: ContentPane calls onChange during render. */
  onChange: (values: ConfigrValues) => void;
  /** pageKey of the top-level page to show, so a remount does not jump to page one. */
  initiallySelectedTopLevelPageKey?: string;
  previewMode: boolean;
}

type PaneChildren = React.ComponentProps<typeof ConfigrPane>['children'];

export const PaneRenderer: React.FunctionComponent<PaneRenderProps> = (props) => {
  const { root } = props;

  /**
   * Memoized on the tree alone, and this matters more than it looks: ContentPane resets the
   * focussed nested page in a `useEffect` keyed on `props.children`
   * (lib/ContentPane.tsx:94). Rebuilding this array every render therefore kicked the user
   * out of any open subpage on every selection, notes toggle and preview toggle. Selection
   * and note visibility reach `Selectable`/`StickyNote` through context instead, so those
   * still update without touching element identity.
   */
  const children = useMemo(() => renderChildren(root), [root]) as PaneChildren;

  if (!hasAnyPage(root)) {
    return (
      <Typography
        variant="body1"
        css={css`
          padding: 24px;
          color: #666;
        `}
      >
        This mockup has no pages yet. Select the pane in the outline, then add a Page.
      </Typography>
    );
  }

  return (
    <ConfigrPane
      label={root.label ?? 'Settings'}
      initialValues={props.initialValues}
      onChange={props.onChange}
      // The library only shows the search box when the app bar is showing too.
      showAppBar={true}
      showSearch={props.previewMode ? root.showSearch : false}
      showJson={props.previewMode ? root.showJson : false}
      initiallySelectedTopLevelPageKey={props.initiallySelectedTopLevelPageKey}
    >
      {children}
    </ConfigrPane>
  );
};
