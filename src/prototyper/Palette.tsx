import { css } from '@emotion/react';
import { Button, Typography } from '@mui/material';
import * as React from 'react';

import { NodeType, paletteTypes, typeLabels } from './model';

export const Palette: React.FunctionComponent<{
  canInsert: (type: NodeType) => boolean;
  insert: (type: NodeType) => void;
  /** Image is the one type whose content comes from outside, so it gets its own handler. */
  insertImageFromClipboard: () => void;
}> = (props) => (
  <div
    css={css`
      padding: 8px;
      border-bottom: 1px solid #ddd;
    `}
  >
    <Typography
      variant="overline"
      css={css`
        color: #666;
      `}
    >
      Add
    </Typography>
    <div
      css={css`
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-top: 4px;
      `}
    >
      {paletteTypes.map((type) => (
        <Button
          key={type}
          size="small"
          variant="outlined"
          disabled={!props.canInsert(type)}
          onClick={() =>
            type === 'image' ? props.insertImageFromClipboard() : props.insert(type)
          }
          title={
            type === 'image'
              ? 'Insert the image on the clipboard. You can also just paste onto the canvas.'
              : undefined
          }
          css={css`
            text-transform: none;
            min-width: 0;
          `}
        >
          {typeLabels[type]}
        </Button>
      ))}
    </div>
  </div>
);
