import { css } from '@emotion/react';
import { Tab, Tabs, ThemeOptions } from '@mui/material';
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { ConfigrAppBar } from './ConfigrAppBar';
import {
  ConfigrLocalizationContext,
  ConfigrLocalizationOverrides,
  defaultConfigrLocalizations,
} from './ConfigrLocalizations';
import { ConfigrArea, ConfigrPage, ConfigrValues, ContentPane } from './ContentPane';
import { SearchContext, SearchContextProvider } from './SearchContextProvider';
import { createTheme, Theme, ThemeProvider } from '@mui/material/styles';
import { defaultConfigrTheme } from './ConfigrTheme';
import { JsonViewer } from '@textea/json-viewer';

export const ConfigrPane: React.FunctionComponent<
  React.PropsWithChildren<{
    label: string;
    initialValues: ConfigrValues;
    children:
      | React.ReactElement<React.ComponentProps<typeof ConfigrPage>>
      | React.ReactElement<React.ComponentProps<typeof ConfigrArea>>
      | Array<
          | React.ReactElement<React.ComponentProps<typeof ConfigrPage>>
          | React.ReactElement<React.ComponentProps<typeof ConfigrArea>>
        >;
    /** Called with the latest values as a plain object (not a JSON string). */
    onChange?: (currentValues: ConfigrValues) => void;
    showAppBar?: boolean;
    showSearch?: boolean;
    themeOverrides?: ThemeOptions;
    showJson?: boolean;
    showRequiredMessage?: boolean;
    localizations?: ConfigrLocalizationOverrides;
    className?: string; // allow client to set things like background color, using emotion or anything else that generates a className
    initiallySelectedTopLevelPageKey?: string;
  }>
> = (props) => {
  // Enhance: Ideally, we'd just say "if you have an outer themeprovider, then
  // we'll merge with our own themes such that the outer one wins. But MUI
  // does the opposite of that, and I haven't figured out a way around it, other
  // than this kludge of having the client have to hand us overrides as a prop.
  // We *can* get at the outer theme in a couple ways, but it comes as a complete
  // set of properties, and I don't see how to know which ones are just defaults
  // and which the client actually cares about.
  //const mergedTheme = createTheme({ ...defaultConfigrTheme, ...props.themeOverrides });
  const localizations = useMemo(
    () => ({ ...defaultConfigrLocalizations, ...props.localizations }),
    [props.localizations],
  );
  const mergedTheme = props.themeOverrides
    ? createTheme(defaultConfigrTheme, props.themeOverrides!)
    : createTheme(defaultConfigrTheme);
  const { topLevelPages, areas } = useMemo(
    () => normalizePaneChildren(props.children),
    [props.children],
  );
  const [currentTopLevelPageIndex, setCurrentTopLevelPageIndex] = useState<
    number | undefined
  >(() =>
    getInitialTopLevelPageIndex(topLevelPages, props.initiallySelectedTopLevelPageKey),
  );
  const [currentAreaIndex, setCurrentAreaIndex] = useState<number | undefined>(undefined);

  const wantAreaChooser = topLevelPages.length > 1;
  const firstEnabledIndex = useMemo(() => findFirstEnabledIndex(areas), [areas]);
  const activeArea = useMemo(() => {
    if (currentAreaIndex === undefined) return undefined;
    return areas[currentAreaIndex];
  }, [areas, currentAreaIndex]);

  const [currentValues, setCurrentValues] = useState<ConfigrValues>(props.initialValues);

  const onChangeWrapper = (newValues: ConfigrValues) => {
    // It's not clear why are allowing onChange to ever be undefined... how else would you get the result?
    // But anyhow, first we call the client...
    if (props.onChange) props.onChange(newValues);
    // and then we update our own state for the sake of the JsonViewer
    setCurrentValues(newValues);
  };

  const { onChange, ...propsToPass } = props;

  useEffect(() => {
    if (!topLevelPages.length) return;
    if (currentTopLevelPageIndex === undefined) return;

    if (
      currentTopLevelPageIndex < 0 ||
      currentTopLevelPageIndex >= topLevelPages.length ||
      isIndexDisabled(areas, currentTopLevelPageIndex)
    ) {
      setCurrentTopLevelPageIndex(firstEnabledIndex);
    }
  }, [areas, currentTopLevelPageIndex, firstEnabledIndex, topLevelPages.length]);

  useEffect(() => {
    if (currentAreaIndex === undefined) return;
    const area = areas[currentAreaIndex];
    if (!area || area.disabled) {
      setCurrentAreaIndex(undefined);
    }
  }, [areas, currentAreaIndex]);

  useEffect(() => {
    if (currentTopLevelPageIndex !== undefined) {
      setCurrentAreaIndex(undefined);
    }
  }, [currentTopLevelPageIndex]);

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        height: 100%;
      `}
    >
      <div
        css={css`
          display: flex;
          flex-direction: row;
          flex: 1;
          height: 100%; // retain the height of the parent for possibly scrollable content (BL-16149)
        `}
      >
        <div
          css={css`
            flex: 1;
          `}
        >
          <ThemeProvider theme={mergedTheme}>
            <ConfigrLocalizationContext.Provider value={localizations}>
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
                                setCurrentAreaIndex(undefined);
                                setCurrentTopLevelPageIndex(
                                  s ? undefined : (firstEnabledIndex ?? 0),
                                );
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
                              currentPageIndex={currentTopLevelPageIndex}
                              setCurrentPageIndex={setCurrentTopLevelPageIndex}
                              currentAreaIndex={currentAreaIndex}
                              setCurrentAreaIndex={setCurrentAreaIndex}
                              areas={areas}
                            />
                          )}
                          <div
                            css={css`
                              flex: 1;
                              min-width: 0;
                              display: flex;
                              flex-direction: column;
                            `}
                          >
                            {activeArea?.content && (
                              <div
                                css={css`
                                  padding: 8px 16px 0 16px;
                                `}
                              >
                                {activeArea.content}
                              </div>
                            )}
                            {currentAreaIndex === undefined && (
                              <ContentPane
                                currentTopLevelPageIndex={currentTopLevelPageIndex}
                                {...propsToPass}
                                onChange={onChangeWrapper}
                              >
                                {topLevelPages}
                              </ContentPane>
                            )}
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  }}
                </SearchContext.Consumer>
              </SearchContextProvider>
            </ConfigrLocalizationContext.Provider>
          </ThemeProvider>
        </div>
        {props.showJson && (
          <div
            css={css`
              white-space: pre;
              padding: 20px;
              border-left: 1px solid #eee;
              width: 300px;
              flex-shrink: 0;
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
    </div>
  );
};

// Centralized spacing controls for the left navigation (areas + pages).
const areaChooserSpacing = {
  betweenAreas: '1rem',
  betweenAreaLabelAndPages: '.5rem',
  betweenPageTabs: '.5rem',
} as const;

const AreaChooser: React.FunctionComponent<
  React.PropsWithChildren<{
    currentPageIndex: number | undefined;
    setCurrentPageIndex: (i: number | undefined) => void;
    currentAreaIndex: number | undefined;
    setCurrentAreaIndex: (i: number | undefined) => void;
    areas: AreaGroup[];
  }>
> = (props) => {
  return (
    <SearchContext.Consumer>
      {({ searchString, setSearchString }) => {
        const handlePageChange = (_event: React.SyntheticEvent, value: number) => {
          if (searchString) {
            console.log('clearing search from onchange from tab');
            setSearchString('');
          }
          props.setCurrentAreaIndex(undefined);
          props.setCurrentPageIndex(value);
        };
        const handleAreaChange = (_event: React.SyntheticEvent, value: number) => {
          if (searchString) {
            console.log('clearing search from onchange from tab');
            setSearchString('');
          }
          props.setCurrentAreaIndex(value);
          props.setCurrentPageIndex(undefined);
        };
        let globalIndex = 0;
        return (
          <div
            css={css`
              min-width: 150px;
              display: flex;
              flex-direction: column;
              gap: ${areaChooserSpacing.betweenAreas};
            `}
          >
            {props.areas.map((area, areaIndex) => {
              if (!area.pages.length) return null;
              const startIndex = globalIndex;
              const endIndex = startIndex + area.pages.length;
              const indent = area.label ? '16px' : '0';
              const headingColor = area.disabled ? '#999' : '#000';
              const headingWeight = area.disabled ? 400 : 500;
              const tabValue =
                props.currentPageIndex === undefined ||
                props.currentPageIndex < startIndex ||
                props.currentPageIndex >= endIndex
                  ? false
                  : props.currentPageIndex;
              globalIndex = endIndex;
              return (
                <div key={`${area.label ?? 'area'}-${areaIndex}`}>
                  {area.label && (
                    <Tabs
                      value={props.currentAreaIndex === areaIndex ? areaIndex : false}
                      onChange={handleAreaChange}
                      centered={false}
                      orientation="vertical"
                      css={css`
                        min-height: 0;
                        margin-bottom: ${areaChooserSpacing.betweenAreaLabelAndPages};
                        .MuiTabs-indicator {
                          display: none;
                        }
                        .Mui-selected {
                          font-weight: bold;
                        }
                        button {
                          min-height: 0;
                          padding-top: 0;
                          padding-bottom: 0;
                          padding-left: 0;
                        }
                      `}
                    >
                      <Tab
                        value={areaIndex}
                        disabled={area.disabled}
                        label={area.label}
                        css={css`
                          font-weight: ${headingWeight};
                          align-items: start;
                          justify-content: flex-start;
                          text-transform: unset;
                          color: ${headingColor};
                          font-size: 13px;
                          &.Mui-selected {
                            color: ${headingColor};
                          }
                        `}
                      />
                    </Tabs>
                  )}
                  <Tabs
                    value={tabValue}
                    onChange={handlePageChange}
                    centered={false}
                    orientation="vertical"
                    css={css`
                      min-height: 0;
                      .MuiTabs-flexContainerVertical {
                        row-gap: ${areaChooserSpacing.betweenPageTabs};
                      }
                      .MuiTabs-indicator {
                        display: none;
                      }
                      .Mui-selected {
                        font-weight: bold;
                      }
                      button {
                        min-height: 0;
                        padding-top: 0;
                        padding-bottom: 0;
                      }
                    `}
                  >
                    {area.pages.map((page, pageIndex) => {
                      const pageDisabled = area.disabled || page.disabled;
                      return (
                        <Tab
                          key={page.element.props.pageKey ?? page.element.props.label}
                          value={startIndex + pageIndex}
                          label={page.element.props.label}
                          disabled={pageDisabled}
                          onClick={() => {
                            props.setCurrentAreaIndex(undefined);
                          }}
                          css={css`
                            font-weight: 500;
                            align-items: start;
                            justify-content: flex-start;
                            text-transform: unset;
                            color: black;
                            font-size: 13px;
                            padding-left: ${indent};
                          `}
                        />
                      );
                    })}
                  </Tabs>
                </div>
              );
            })}
          </div>
        );
      }}
    </SearchContext.Consumer>
  );
};

type ConfigrPaneChild =
  | React.ReactElement<React.ComponentProps<typeof ConfigrPage>>
  | React.ReactElement<React.ComponentProps<typeof ConfigrArea>>
  | false
  | undefined
  | null;

type ConfigrPaneChildren = ConfigrPaneChild | ConfigrPaneChild[];

type AreaPage = {
  element: React.ReactElement<React.ComponentProps<typeof ConfigrPage>>;
  disabled?: boolean;
};

type AreaGroup = {
  label?: string;
  content?: React.ReactNode;
  disabled?: boolean;
  pages: AreaPage[];
};

function normalizePaneChildren(children: ConfigrPaneChildren): {
  topLevelPages: React.ReactElement<React.ComponentProps<typeof ConfigrPage>>[];
  areas: AreaGroup[];
} {
  const childArray = React.Children.toArray(children).filter((c) => c);
  if (childArray.length === 0) return { topLevelPages: [], areas: [] };

  const hasAreas = childArray.some((child) => isConfigrArea(child));
  if (!hasAreas) {
    const invalidChild = childArray.find((child) => !isConfigrPage(child));
    if (invalidChild) {
      throw Error('<ConfigrPane> children must be ConfigrPage or ConfigrArea elements.');
    }
    const pages = (
      childArray as React.ReactElement<React.ComponentProps<typeof ConfigrPage>>[]
    ).map((page) => ({ element: page, disabled: page.props.disabled }));
    return {
      topLevelPages: pages.map((page) => page.element),
      areas: [{ label: undefined, pages }],
    };
  }

  const topLevelPages: React.ReactElement<React.ComponentProps<typeof ConfigrPage>>[] =
    [];
  const areas: AreaGroup[] = [];

  childArray.forEach((child) => {
    if (isConfigrArea(child)) {
      const areaChildren = React.Children.toArray(child.props.children).filter((c) => c);
      const invalidAreaChild = areaChildren.find((c) => !isConfigrPage(c));
      if (invalidAreaChild) {
        throw Error(
          `<ConfigrArea label="${child.props.label}"> children must be ConfigrPage elements.`,
        );
      }
      const pages = (
        areaChildren as React.ReactElement<React.ComponentProps<typeof ConfigrPage>>[]
      ).map((page) => ({ element: page, disabled: page.props.disabled }));
      if (pages.length > 0) {
        areas.push({
          label: child.props.label,
          content: child.props.content,
          disabled: child.props.disabled,
          pages,
        });
        topLevelPages.push(...pages.map((page) => page.element));
      }
      return;
    }

    if (isConfigrPage(child)) {
      areas.push({
        label: undefined,
        pages: [{ element: child, disabled: child.props.disabled }],
      });
      topLevelPages.push(child);
      return;
    }

    throw Error('<ConfigrPane> children must be ConfigrPage or ConfigrArea elements.');
  });

  return { topLevelPages, areas };
}

function isConfigrArea(
  child: React.ReactNode,
): child is React.ReactElement<React.ComponentProps<typeof ConfigrArea>> {
  return React.isValidElement(child) && child.type === ConfigrArea;
}

function isConfigrPage(
  child: React.ReactNode,
): child is React.ReactElement<React.ComponentProps<typeof ConfigrPage>> {
  return React.isValidElement(child) && child.type === ConfigrPage;
}

function findFirstEnabledIndex(areas: AreaGroup[]): number | undefined {
  let index = 0;
  for (const area of areas) {
    for (const page of area.pages) {
      if (!area.disabled && !page.disabled) return index;
      index += 1;
    }
  }
  return undefined;
}

function getInitialTopLevelPageIndex(
  topLevelPages: React.ReactElement<React.ComponentProps<typeof ConfigrPage>>[],
  initiallySelectedTopLevelPageKey?: string,
): number {
  if (!initiallySelectedTopLevelPageKey) return 0;

  const pageIndex = topLevelPages.findIndex(
    (page) => page.props.pageKey === initiallySelectedTopLevelPageKey,
  );
  return pageIndex >= 0 ? pageIndex : -1;
}

function isIndexDisabled(areas: AreaGroup[], index: number) {
  let current = 0;
  for (const area of areas) {
    for (const page of area.pages) {
      if (current === index) return !!(area.disabled || page.disabled);
      current += 1;
    }
  }
  return true;
}
