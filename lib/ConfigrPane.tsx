import { css } from '@emotion/react';
import { Tab, Tabs, ThemeOptions } from '@mui/material';
import * as React from 'react';
import { useMemo, useState } from 'react';
import { ConfigrAppBar } from './ConfigrAppBar';
import { ConfigrPage, ContentPane } from './ContentPane';
import { SearchContext, SearchContextProvider } from './SearchContextProvider';
import { createTheme, Theme, ThemeProvider } from '@mui/material/styles';
import { defaultConfigrTheme } from './ConfigrTheme';
import { JsonViewer } from '@textea/json-viewer';

export const ConfigrPane: React.FunctionComponent<
  React.PropsWithChildren<{
    label: string;
    initialValues: object;
    children:
      | React.ReactElement<typeof ConfigrPage>
      | React.ReactElement<typeof ConfigrPage>[];
    onChange?: (currentValues: any) => void;
    showAppBar?: boolean;
    showSearch?: boolean;
    showAllGroups?: boolean;
    themeOverrides?: ThemeOptions;
    showJson?: boolean;
    className?: string; // allow client to set things like background color, using emotion or anything else that generates a className
    initiallySelectedTopLevelPageIndex?: number;
  }>
> = (props) => {
  const [currentTopLevelPageIndex, setCurrentTopLevelPageIndex] = useState<
    number | undefined
  >(props.initiallySelectedTopLevelPageIndex ?? 0);

  // Enhance: Ideally, we'd just say "if you have an outer themeprovider, then
  // we'll merge with our own themes such that the outer one wins. But MUI
  // does the opposite of that, and I haven't figured out a way around it, other
  // than this kludge of having the client have to hand us overrides as a prop.
  // We *can* get at the outer theme in a couple ways, but it comes as a complete
  // set of properties, and I don't see how to know which ones are just defaults
  // and which the client actually cares about.
  //const mergedTheme = createTheme({ ...defaultConfigrTheme, ...props.themeOverrides });
  const mergedTheme = props.themeOverrides
    ? createTheme(defaultConfigrTheme, props.themeOverrides!)
    : createTheme(defaultConfigrTheme);

  const wantAreaChooser = React.Children.toArray(props.children).length > 1;

  const [currentValues, setCurrentValues] = useState(props.initialValues);

  const onChangeWrapper = (newValues: any) => {
    // It's not clear why are allowing onChange to ever be undefined... how else would you get the result?
    // But anyhow, first we call the client...
    if (props.onChange) props.onChange(newValues);
    // and then we update our own state for the sake of the JsonViewer
    setCurrentValues(newValues);
  };

  const { onChange, ...propsToPass } = props;

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
      `}
    >
      <ThemeProvider theme={mergedTheme}>
        <SearchContextProvider>
          <SearchContext.Consumer>
            {({ searchString, setSearchString }) => {
              return (
                <React.Fragment>
                  {props.showAppBar && (
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
                          setCurrentTopLevelPageIndex(s ? undefined : 0);
                        }
                      }}
                    />
                  )}
                  <div
                    id="configr-pane"
                    css={css`
                      // no. Make client set the background color: background-color: #f8f9fa;
                      height: 100%;
                      display: flex;
                      //padding-left: ${wantAreaChooser ? undefined : '20px'};
                      .MuiTab-wrapper {
                        text-align: left;
                        align-items: start;
                      }
                    `}
                    className={props.className} // allow client to set things like background color
                  >
                    {wantAreaChooser && (
                      <AreaChooser
                        currentGroup={currentTopLevelPageIndex}
                        setCurrentAreaIndex={setCurrentTopLevelPageIndex}
                      >
                        {props.children}
                      </AreaChooser>
                    )}
                    <ContentPane
                      currentTopLevelPageIndex={currentTopLevelPageIndex}
                      {...propsToPass}
                      onChange={onChangeWrapper}
                    />
                  </div>
                </React.Fragment>
              );
            }}
          </SearchContext.Consumer>
        </SearchContextProvider>
      </ThemeProvider>
      {props.showJson && (
        <div
          css={css`
            white-space: pre;
            margin-left: 20px;
            .data-type-label {
              color: lightblue;
              font-size: 7px;
            }
          `}
        >
          <JsonViewer value={currentValues}></JsonViewer>
        </div>
      )}
    </div>
  );
};

const AreaChooser: React.FunctionComponent<
  React.PropsWithChildren<{
    currentGroup: number | undefined;
    setCurrentAreaIndex: (i: number | undefined) => void;
  }>
> = (props) => {
  const areaLinks = useMemo(() => {
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
              props.setCurrentAreaIndex(index);
            }}
            centered={false}
            orientation="vertical"
            css={css`
              min-width: 150px;
              .MuiTabs-indicator {
                display: none;
              }
              .Mui-selected {
                font-weight: bold;
              }
              button {
                padding-left: 0;
                min-height: 0;
                padding-top: 0;
              }
            `}
          >
            {areaLinks}
          </Tabs>
        );
      }}
    </SearchContext.Consumer>
  );
};
