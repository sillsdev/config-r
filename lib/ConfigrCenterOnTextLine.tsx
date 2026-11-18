import { css } from '@emotion/react';
import * as React from 'react';

// A two-column row lines up its label and its control on their first line of text (their
// baselines). A control with no text of its own, such as a checkbox, an icon or a color swatch,
// has no baseline, so the browser would line up its bottom edge with the label's text instead.
// Wrap such a control in this: it gives the control an invisible line of text and centres the
// control on that line, the way an icon sits in a line of text.
export const ConfigrCenterOnTextLine: React.FunctionComponent<
  React.PropsWithChildren<unknown>
> = (props) => {
  return (
    <span
      css={css`
        display: inline-flex;
        align-items: center;
        &::before {
          content: '\\200b';
        }
      `}
    >
      {props.children}
    </span>
  );
};
