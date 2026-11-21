import * as React from 'react';
import { useEffect, useRef } from 'react';
import Mark from 'mark.js';
import { Box } from '@mui/material';

export const HighlightSearchTerms: React.FunctionComponent<
  React.PropsWithChildren<{
    searchString: string | null;
    // we don't care what this means, we just know that we need
    // to re-render if this changes
    focussedPageKey: any;
  }>
> = (props) => {
  const highlightRoot = useRef<HTMLDivElement>(null);

  // mark.js is not a React thing: it wraps matches in <mark> elements in the DOM that React
  // has already rendered. So mark again after every render, which may have shown new rows or
  // replaced the text of marked ones. Search the whole term, not each word, the same way the
  // filter matches, so that every setting that shows has a highlight.
  useEffect(() => {
    if (!highlightRoot.current) return;
    const markInstance = new Mark(highlightRoot.current);
    markInstance.unmark({
      done: () => {
        if (props.searchString)
          markInstance.mark(props.searchString, {
            separateWordSearch: false,
            diacritics: false,
            // Part of config-r's API, for hosts to style the highlight (see the README).
            className: 'configr-search-match',
          });
      },
    });
  });

  return (
    <Box
      ref={highlightRoot}
      sx={(theme) => ({
        '& mark.configr-search-match': { backgroundColor: theme.palette.searchMatch },
      })}
    >
      {props.children}
    </Box>
  );
};
