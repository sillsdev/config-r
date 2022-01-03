import React from 'react';
import { ConfigrAppBar } from './ConfigrAppBar';
import { ConfigrPane, IConfigrPaneProps } from './ConfigrPane';
import { SearchSystem } from './SearchSystem';

export const ChromeSettings: React.FunctionComponent<IConfigrPaneProps> = (props) => {
  return (
    <SearchSystem>
      <ConfigrAppBar label={props.label} />
      <ConfigrPane {...props} />
    </SearchSystem>
  );
};
