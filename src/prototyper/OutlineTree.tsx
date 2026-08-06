// The document outline. This is the only way to select a container, since containers
// cannot be wrapped in a click handler without tripping the library's identity checks.
import { css } from '@emotion/react';
import { List, ListItemButton, Typography } from '@mui/material';
import * as React from 'react';

import { ProtoNode, typeLabels } from './model';

const Row: React.FunctionComponent<{
  node: ProtoNode;
  depth: number;
  selectedId: string;
  select: (id: string) => void;
}> = ({ node, depth, selectedId, select }) => {
  const selected = node.id === selectedId;
  return (
    <>
      <ListItemButton
        selected={selected}
        onClick={() => select(node.id)}
        css={css`
          padding: 2px 8px 2px ${8 + depth * 14}px;
          gap: 6px;
          align-items: baseline;
        `}
      >
        <Typography
          variant="caption"
          css={css`
            color: #888;
            font-size: 10px;
            text-transform: uppercase;
            flex-shrink: 0;
          `}
        >
          {typeLabels[node.type]}
        </Typography>
        <Typography
          variant="body2"
          css={css`
            font-weight: ${selected ? 600 : 400};
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          `}
        >
          {node.label || node.text || '(unlabeled)'}
        </Typography>
        {node.note && (
          <span
            title={node.note}
            css={css`
              flex-shrink: 0;
              width: 8px;
              height: 8px;
              border-radius: 2px;
              background-color: #7bc95f;
            `}
          />
        )}
      </ListItemButton>
      {(node.children ?? []).map((child) => (
        <Row
          key={child.id}
          node={child}
          depth={depth + 1}
          selectedId={selectedId}
          select={select}
        />
      ))}
    </>
  );
};

export const OutlineTree: React.FunctionComponent<{
  root: ProtoNode;
  selectedId: string;
  select: (id: string) => void;
}> = (props) => (
  <List
    dense
    disablePadding
    css={css`
      overflow-y: auto;
      flex: 1;
    `}
  >
    <Row
      node={props.root}
      depth={0}
      selectedId={props.selectedId}
      select={props.select}
    />
  </List>
);
