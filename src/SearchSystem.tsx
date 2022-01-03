import React, { useState, useEffect } from 'react';

export const SearchContext = React.createContext({
  searchString: '' as string | null,
  searchRegEx: null as RegExp | null,
  setSearchString: (searchString: string | null) => {},
});

export const SearchSystem: React.FunctionComponent<{
  currentTab: any;
}> = (props) => {
  const defaultSearch = ''; //   new RegExp('(foo)', 'gi'),
  const [searchString, setSearchString] = useState<string | null>(defaultSearch);

  const handleSet = (value: string | null) => {
    if (!value || !value.trim()) {
      setSearchString(null);
      // this is the behavior in Chrome & Edge... once you search, we forget what the selected group was,
      // so that if you cancel the search, you're back to the beginning
      //setCurrentTab(0);
    } else {
      setSearchString(value);
      // the ide of current tab goes away during a search, so don't highlight one
      //TODO: this is not allowed (console error)... so how else
      // setCurrentTab(undefined);
    }
  };

  useEffect(() => {
    setSearchString(defaultSearch);
  }, [props.currentTab]);

  // enhance: would the "react-children-utilities/Children" utilities simplify this?
  return (
    <SearchContext.Provider
      value={{
        searchString: searchString,
        searchRegEx: searchString
          ? new RegExp(searchString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
          : null,
        setSearchString: handleSet,
      }}>
      {props.children}
    </SearchContext.Provider>
  );
};
