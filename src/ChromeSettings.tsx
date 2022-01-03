import { css } from '@emotion/react';
import { Tab, Tabs } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { ConfigrAppBar } from './ConfigrAppBar';
import { ConfigrGroup, ConfigrPane, IConfigrPaneProps } from './ConfigrPane';
import { SearchContext, SearchContextProvider } from './SearchContextProvider';

export const ChromeSettings: React.FunctionComponent<{
  label: string;
  initialValues: object;
  children:
    | React.ReactElement<typeof ConfigrGroup>
    | React.ReactElement<typeof ConfigrGroup>[];
  // review; what's this about?
  //setValueGetter?: (vg: valueGetter) => void;
  showSearch?: boolean;
  showAllGroups?: boolean;
  themeOverrides?: any;
}> = (props) => {
  const [currentTab, setCurrentTab] = useState<number | undefined>(0);

  return (
    <SearchContextProvider>
      <SearchContext.Consumer>
        {({ searchString, setSearchString }) => {
          return (
            <React.Fragment>
              <ConfigrAppBar
                label={props.label}
                searchValue={searchString}
                setSearchString={(s: string) => {
                  setSearchString(s);
                  // There should be no selected group if we
                  // have a search term. If the user clears the search,
                  // then we set the selected group to be the 1st one (0).
                  setCurrentTab(s ? undefined : 0);
                }}
              />
              <div
                css={css`
                  background-color: #f8f9fa;
                  height: 100%;
                  display: flex;

                  .MuiTab-wrapper {
                    text-align: left;
                    align-items: start;
                  }
                `}>
                <GroupChooser
                  currentGroup={currentTab}
                  setCurrentGroupIndex={setCurrentTab}>
                  {props.children}
                </GroupChooser>
                <ConfigrPane currentTab={currentTab} {...props} />
              </div>
            </React.Fragment>
          );
        }}
      </SearchContext.Consumer>
    </SearchContextProvider>
  );
};

const GroupChooser: React.FunctionComponent<{
  currentGroup: number | undefined;
  setCurrentGroupIndex: (i: number | undefined) => void;
}> = (props) => {
  const groupLinks = useMemo(() => {
    return React.Children.map(props.children, (g: any) => (
      <Tab
        key={g.props.label}
        label={g.props.label}
        css={css`
          font-weight: 500;
          align-items: start;
          text-transform: unset;
          color: black;
          font-weight: 500;
          font-size: 13px;
        `}></Tab>
    ));
  }, [props.children]);

  return (
    <SearchContext.Consumer>
      {({ searchString, setSearchString }) => {
        return (
          <Tabs
            value={props.currentGroup === undefined ? false : props.currentGroup}
            onChange={(event: React.ChangeEvent<{}>, index: number) => {
              if (searchString) {
                console.log('clearing search from onchange from tab');
                setSearchString('');
                //setHackToClearSearch(Date.now());
              }
              props.setCurrentGroupIndex(index);
            }}
            centered={false}
            orientation="vertical"
            css={css`
              min-width: 150px;
              padding-left: 12px;
              .MuiTabs-indicator {
                display: none;
              }
              .Mui-selected {
                font-weight: bold;
              }
            `}>
            {groupLinks}
          </Tabs>
        );
      }}
    </SearchContext.Consumer>
  );
};
