import * as React from 'react';
import Children from 'react-children-utilities';
import { SearchContext } from './SearchContextProvider';

// If Search is empty, pass through.
// Else, pass through so long as the given label or kids have the search term
export const FilterForSearchText: React.FunctionComponent<
  React.PropsWithChildren<{
    label?: string;
    description?: string | React.ReactNode;
    kids: React.ReactNode;
  }>
> = (props) => {
  // enhance: would the "react-children-utilities/Children" utilities simplify this?
  return (
    <SearchContext.Consumer>
      {({ searchRegEx }) => {
        if (!searchRegEx) return <React.Fragment>{props.children}</React.Fragment>;
        const hasMatch =
          /* TODO: currently, if we match on a group's label or description,
           but then don't match on a group,
          well we just get the label and that's confusing. */
          (props.label && searchRegEx.test(props.label)) ||
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
            // Does this child have children we can check?
            // TODO: this would need to be recursive. Currently it is blocked by groups.
            // This is more than just checking recursively. If we find a match 3 levels
            // down, it's not really enough to just return true and show the great-great-grandchild.
            // The user can't tell which of the children of that they are supposed to go down to find
            // the item(s) we matched on.
            // We need to mark the intermediate parents. Look at what Chrome settings does, UI-wise. E.g., search Chrome settings
            // for "sans-serif". It shows the "Appearance" group, then puts a yellow tooltip on the
            // "Customize fonts" subpage button. Then when you follow that, it highlights the "Sans-serif".
            // TODO: we should also be looking at `searchTerms`
            const children = (c as any).props?.children;
            if (children) {
              // among these children...
              return React.Children.toArray(children).some((configrItem: any) => {
                // ... is there a child (a row of a sub page) that has a label that matches?
                if (configrItem?.props?.label) {
                  // check the label in a great-grand-child (row of a sub page)
                  return searchRegEx.test(configrItem.props.label);
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
