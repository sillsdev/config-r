import { css } from '@emotion/react';
import { Tab, Tabs } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { ConfigrAppBar } from './ConfigrAppBar';
import { ConfigrGroup, ContentPane } from './ContentPane';
import { SearchContext, SearchContextProvider } from './SearchContextProvider';
import { createTheme, Theme, ThemeProvider } from '@mui/material/styles';
import { defaultConfigrTheme } from './ConfigrTheme';

export const ConfigrPane: React.FunctionComponent<{
  label: string;
  initialValues: object;
  children:
    | React.ReactElement<typeof ConfigrGroup>
    | React.ReactElement<typeof ConfigrGroup>[];
  // review; what's this about?
  //setValueGetter?: (vg: valueGetter) => void;
  setValueOnRender?: (currentValues: any) => void;
  showSearch?: boolean;
  showAllGroups?: boolean;
  themeOverrides?: any;
}> = (props) => {
  const [currentGroup, setcurrentGroup] = useState<number | undefined>(0);

  // Enhance: Ideally, we'd just say "if you have an outer themeprovider, then
  // we'll merge with our own themes such that the outer one wins. But MUI
  // does the opposite of that, and I haven't figured out a way around it, other
  // than this kludge of having the client have to hand us overrides as a prop.
  // We *can* get at the outer theme in a couple ways, but it comes as a complete
  // set of properties, and I don't see how to know which ones are just defaults
  // and which the client actually cares about.
  const mergedTheme = createTheme({ ...defaultConfigrTheme, ...props.themeOverrides });

  const wantGroupChooser = React.Children.toArray(props.children).length > 1;

  return (
    <ThemeProvider theme={mergedTheme}>
      <SearchContextProvider>
        <SearchContext.Consumer>
          {({ searchString, setSearchString }) => {
            return (
              <React.Fragment>
                <ConfigrAppBar
                  label={props.label}
                  showSearch={props.showSearch}
                  searchValue={searchString}
                  setSearchString={(s: string) => {
                    if (searchString !== s) {
                      setSearchString(s);
                      // There should be no selected group if we
                      // have a search term. If the user clears the search,
                      // then we set the selected group to be the 1st one (0).
                      setcurrentGroup(s ? undefined : 0);
                    }
                  }}
                />
                <div
                  css={css`
                    background-color: #f8f9fa;
                    height: 100%;
                    display: flex;
                    padding-right: 20px;

                    .MuiTab-wrapper {
                      text-align: left;
                      align-items: start;
                    }
                  `}
                >
                  {wantGroupChooser && <GroupChooser
                    currentGroup={currentGroup}
                    setCurrentGroupIndex={setcurrentGroup}
                  >
                    {props.children}
                  </GroupChooser>}
                  <ContentPane currentGroupIndex={currentGroup} {...props} />
                </div>
              </React.Fragment>
            );
          }}
        </SearchContext.Consumer>
      </SearchContextProvider>
    </ThemeProvider>
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
        `}
      ></Tab>
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
            `}
          >
            {groupLinks}
          </Tabs>
        );
      }}
    </SearchContext.Consumer>
  );
};
