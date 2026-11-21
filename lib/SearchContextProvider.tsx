import * as React from 'react';

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const SearchContext = React.createContext({
  searchString: '' as string | null,
  searchRegEx: null as RegExp | null,
  setSearchString: (searchString: string | null) => {},
});

// The search state belongs to the pane, which ends a search when a client selects a page, so
// this provider takes it as props.
export const SearchContextProvider: React.FunctionComponent<
  React.PropsWithChildren<{
    searchString: string | null;
    setSearchString: (searchString: string | null) => void;
  }>
> = (props) => {
  const handleSet = (value: string | null) => {
    if (!value || !value.trim()) {
      props.setSearchString(null);
    } else {
      props.setSearchString(value);
    }
  };

  return (
    <SearchContext.Provider
      value={{
        searchString: props.searchString,
        searchRegEx: props.searchString
          ? new RegExp(escapeRegExp(props.searchString), 'i')
          : null,
        setSearchString: handleSet,
      }}
    >
      {props.children}
    </SearchContext.Provider>
  );
};
