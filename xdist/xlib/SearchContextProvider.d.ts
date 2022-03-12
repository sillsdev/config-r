import React from 'react';
export declare const SearchContext: React.Context<{
    searchString: string | null;
    searchRegEx: RegExp | null;
    setSearchString: (searchString: string | null) => void;
}>;
export declare const SearchContextProvider: React.FunctionComponent<{}>;
