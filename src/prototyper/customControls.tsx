// Registry of hand-written controls that a `custom` node can name.
//
// Custom field editors cannot live in a JSON document, so they live here in code. To add
// one, write the component and add it to `customControls`; Vite hot-reloads and the name
// appears in the inspector's dropdown. Use ConfigrCustomStringInput/ConfigrCustomObjectInput
// when you want a Formik-bound value (see src/stories/SILCharacterAlternates.tsx); a plain
// component is fine for pure visuals like these.
import { css } from '@emotion/react';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import WarningIcon from '@mui/icons-material/Warning';
import { Button, ListItem, Typography } from '@mui/material';
import * as React from 'react';

/**
 * What the renderer hands every custom control: the node's own label and description, plus
 * whatever is in the node's `customProps` (edited as JSON in the inspector).
 */
export type CustomControlProps = {
  label?: string;
  description?: string;
} & Record<string, unknown>;

/**
 * The bold language-name row with a right chevron, mirroring how the library renders a
 * nested page's navigation row. Optional caption sits under the name.
 */
const LanguageNameHeader: React.FunctionComponent<CustomControlProps> = (props) => (
  <ListItem
    css={css`
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
    `}
  >
    <div>
      <Typography
        variant="h4"
        css={css`
          font-weight: 500;
        `}
      >
        {props.label ?? ''}
      </Typography>
      {typeof props.caption === 'string' && props.caption && (
        <Typography
          variant="caption"
          css={css`
            display: block;
            margin-top: 4px;
          `}
        >
          {props.caption}
        </Typography>
      )}
    </div>
    <ArrowRightIcon
      css={css`
        color: rgba(0, 0, 0, 0.7);
        flex-shrink: 0;
      `}
    />
  </ListItem>
);

/**
 * The block that sits above a language card: heading, a grey "Example: ..." caption, and
 * an optional REMOVE link. The link is deliberately dead; this is a mockup.
 */
const SectionHeader: React.FunctionComponent<CustomControlProps> = (props) => (
  <div
    css={css`
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 16px;
      margin-top: 8px;
    `}
  >
    <div>
      <Typography variant="h3">{props.label ?? ''}</Typography>
      {typeof props.caption === 'string' && props.caption && (
        <Typography
          variant="caption"
          css={css`
            display: block;
            color: #808080;
          `}
        >
          {props.caption}
        </Typography>
      )}
    </div>
    {!!props.showRemove && (
      // A Button rather than a Link: it does not navigate, and jsx-a11y rightly objects to
      // an anchor that only looks like one.
      <Button
        size="small"
        css={css`
          font-size: 13px;
          padding: 0;
          min-width: 0;
          color: #1a7f8e;
        `}
      >
        Remove
      </Button>
    )}
  </div>
);

/** Split on `**bold**` markers so a callout can emphasize words like SURE and KNOW. */
function renderWithBold(text: string) {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .map((chunk, i) =>
      chunk.startsWith('**') && chunk.endsWith('**') ? (
        <strong key={i}>{chunk.slice(2, -2)}</strong>
      ) : (
        <React.Fragment key={i}>{chunk}</React.Fragment>
      ),
    );
}

/** The yellow warning banner. `text` may use `**...**` to bold words. */
const WarningCallout: React.FunctionComponent<CustomControlProps> = (props) => (
  <div
    css={css`
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin: 4px 16px 12px 16px;
      padding: 12px 16px;
      background-color: #f3ba4e;
      border-radius: 2px;
    `}
  >
    <WarningIcon
      css={css`
        color: #4a3a10;
        font-size: 20px;
        flex-shrink: 0;
      `}
    />
    <Typography
      variant="body2"
      css={css`
        color: #2b2b2b;
      `}
    >
      {renderWithBold(typeof props.text === 'string' ? props.text : '')}
    </Typography>
  </div>
);

export const customControls: Record<
  string,
  React.FunctionComponent<CustomControlProps>
> = {
  LanguageNameHeader,
  SectionHeader,
  WarningCallout,
};

export const customControlNames = Object.keys(customControls);
