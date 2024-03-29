import * as React from 'react';
import { useState } from 'react';

export const SearchContext = React.createContext({
  searchString: '' as string | null,
  searchRegEx: null as RegExp | null,
  setSearchString: (searchString: string | null) => {},
});

export const SearchContextProvider: React.FunctionComponent<
  React.PropsWithChildren<{}>
> = (props) => {
  const defaultSearch = ''; //   new RegExp('(foo)', 'gi'),
  const [searchString, setSearchString] = useState<string | null>(defaultSearch);

  const handleSet = (value: string | null) => {
    if (!value || !value.trim()) {
      setSearchString(null);
    } else {
      setSearchString(value);
    }
  };

  return (
    <SearchContext.Provider
      value={{
        searchString: searchString,
        searchRegEx: searchString
          ? new RegExp(searchString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
          : null,
        setSearchString: handleSet,
      }}
    >
      {props.children}
    </SearchContext.Provider>
  );
};
