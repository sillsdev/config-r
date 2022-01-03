import React, { useMemo, useState, useEffect, ReactElement, ReactNode } from 'react';
import Children from 'react-children-utilities';
import { SearchContext } from './SearchSystem';

// If Search is empty, pass through.
// Else, pass through so long as the given label or kids have the search term
export const FilterForSearchText: React.FunctionComponent<{
  label: string;
  description?: string | React.ReactNode;
  kids: React.ReactNode;
}> = (props) => {
  // enhance: would the "react-children-utilities/Children" utilities simplify this?
  return (
    <SearchContext.Consumer>
      {({ searchRegEx }) => {
        if (!searchRegEx) return <React.Fragment>{props.children}</React.Fragment>;
        const hasMatch =
          /* TODO: currently, if we match on a group's label or description,
           but then don't match on a subgroup,
          well we just get the label and that's confusing. */
          searchRegEx.test(props.label) ||
          (props.description && searchRegEx.test(Children.onlyText(props.description))) ||
          // check the children (rows of the group)
          React.Children.toArray(props.kids).some((c) => {
            const componentWithLabelProp = (c as any).props?.label;
            if (componentWithLabelProp && searchRegEx.test(componentWithLabelProp))
              // this grandchild has the search string, directly
              return true;
            const componentWithSearchTermsProp = (c as any).props?.searchTerms;
            if (
              componentWithSearchTermsProp &&
              searchRegEx.test(componentWithSearchTermsProp)
            )
              return true;
            // Is this child a subpage? Then it has children we can check.
            const childrenOfSubPage = (c as any).props?.children;
            if (childrenOfSubPage) {
              // among these children...
              return React.Children.toArray(childrenOfSubPage).some((c: any) => {
                // ... is there a child (a row of a sub page) that has a label that matches?
                if (c?.props?.label) {
                  // check the label in a great-grand-child (row of a sub page)
                  return searchRegEx.test(c.props.label);
                }
              });
            }
          });
        if (hasMatch) {
          return <React.Fragment>{props.children}</React.Fragment>; // show this child (a group)
        }
      }}
    </SearchContext.Consumer>
  );
};
