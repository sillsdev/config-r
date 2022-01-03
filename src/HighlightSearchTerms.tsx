import React, { useState, useEffect, useRef } from 'react';
import Mark from 'mark.js';

export const HighlightSearchTerms: React.FunctionComponent<{
  searchString: string | null;
  // we don't care what this means, we just know that we need
  // to re-render if this changes
  focussedSubPagePath: any;
}> = (props) => {
  const [markInstance, setMarkInstance] = useState<Mark>();
  const highlightRoot = useRef(null);

  // Note, mark.js is not a react thing. It operates on the DOM
  // that exists.
  React.useEffect(() => {
    if (highlightRoot.current) {
      setMarkInstance(new Mark(highlightRoot.current));
    }
  }, [highlightRoot.current]);

  useEffect(() => {
    if (markInstance)
      markInstance.unmark({
        done: () => {
          if (props.searchString) markInstance.mark(props.searchString);
        },
      });
  }, [props.searchString, props.focussedSubPagePath]);

  return <div ref={highlightRoot}>{props.children}</div>;
};
