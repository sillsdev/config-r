import { css, SerializedStyles } from '@emotion/react';
import React, { useMemo, useState, useEffect, ReactElement, ReactNode } from 'react';

import { ConfigrAppBar } from './ConfigrAppBar';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { createTheme, Theme, ThemeProvider } from '@mui/material/styles';
import { useTheme } from '@mui/styles';

import toPath from 'lodash/toPath';

import { Field, Formik, useField, useFormikContext } from 'formik';
import {
  Tab,
  Tabs,
  Typography,
  Paper,
  List,
  Divider,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  FormControlLabel,
  Radio,
  RadioGroup,
  Button,
  ListItemButton,
  MenuItem,
  Select as MuiSelect,
  Tooltip,
} from '@mui/material';
import { TextField, Switch, Checkbox, Select as FormikMuiSelect } from 'formik-mui';
import { HighlightSearchTerms } from './HighlightSearchTerms';
import { FilterForSearchText, SearchContext } from './FilterForSearch';

type valueGetter = () => Object;

interface IConfigrPaneProps {
  label: string;
  initialValues: object;
  children:
    | React.ReactElement<typeof ConfigrGroup>
    | React.ReactElement<typeof ConfigrGroup>[];
  setValueGetter?: (vg: valueGetter) => void;
  showSearch?: boolean;
  showAllGroups?: boolean;
  themeOverrides?: any;
}
const tabBarWidth = '200px';
const disabledGrey = 'rgba(5, 1, 1, 0.26)';
const secondaryGrey = 'rgba(0, 0, 0, 0.54)';

const FocusPageContext = React.createContext({
  focussedSubPagePath: '',
  setFocussedSubPagePath: (p: string) => {},
});

export const defaultConfigrTheme = {
  typography: {
    fontFamily: [
      'system-ui',
      '"Segoe UI"',
      'Roboto',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h2: {
      fontSize: '20px',
      fontWeight: '600',
    },
    h3: {
      fontSize: '14px',
      fontWeight: '600',
    },
    // the primary label on controls
    h4: {
      fontSize: '14px',
      fontWeight: '600',
    },
    // the explanation text below controls
    caption: {
      fontSize: '12px',
      lineHeight: '14px',
      marginTop: '4px',
    },
  },
  components: {
    MuiSelect: {
      styleOverrides: { select: { fontSize: '14px' } },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: 'rgb(234, 234, 234)' } },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontSize: '14px',
          fontWeight: '600', //<-- gives an eslint error about the type but it works
        },
      },
    },
  },
};

export const ConfigrPane: React.FunctionComponent<IConfigrPaneProps> = (props) => {
  const [currentTab, setCurrentTab] = useState<number | undefined>(0);

  // We allow a single level of nesting (see ConfigrSubPage), that is all that is found in Chrome Settings.
  // A stack would be easy but it would put some strain on the UI to help the user not be lost.
  const [focussedSubPagePath, setFocussedSubPagePath] = useState('');
  const defaultSearch = ''; //   new RegExp('(foo)', 'gi'),
  const [searchString, setSearchString] = useState<string | null>(defaultSearch);

  useEffect(() => {
    setSearchString(defaultSearch);
  }, [currentTab]);

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
  // Enhance: Ideally, we'd just say "if you have an outer themeprovider, then
  // we'll merge with our own themes such that the outer one wins. But MUI
  // does the opposite of that, and I haven't figured out a way around it, other
  // than this kludge of having the client have to hand us overrides as a prop.
  // We *can* get at the outer theme in a couple ways, but it comes as a complete
  // set of properties, and I don't see how to know which ones are just defaults
  // and which the client actually cares about.
  const mergedTheme = createTheme({ ...defaultConfigrTheme, ...props.themeOverrides });
  return (
    <ThemeProvider theme={mergedTheme}>
      <FocusPageContext.Provider
        value={{
          focussedSubPagePath: focussedSubPagePath,
          setFocussedSubPagePath: setFocussedSubPagePath,
        }}>
        <SearchContext.Provider
          value={{
            searchString,

            searchRegEx: searchString
              ? new RegExp(searchString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
              : null,
            setSearchString,
          }}>
          <Formik initialValues={props.initialValues} onSubmit={(values) => {}}>
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => {
              if (props.setValueGetter)
                props.setValueGetter(() => {
                  return values;
                });
              return (
                <form
                  onSubmit={handleSubmit}
                  css={css`
                    flex-grow: 1;
                  `}>
                  <ConfigrAppBar
                    label={props.label}
                    onChange={(value: string) => {
                      if (!value.trim()) {
                        setSearchString(null);
                        // this is the behavior in Chrome & Edge... once you search, we forget what the selected group was,
                        // so that if you cancel the search, you're back to the beginning
                        setCurrentTab(0);
                      } else {
                        setSearchString(value);
                        // the ide of current tab goes away during a search, so don't highlight one
                        //TODO: this is not allowed (console error)... so how else
                        // setCurrentTab(undefined);
                      }
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
                    <Tabs
                      value={currentTab}
                      onChange={(event: React.ChangeEvent<{}>, index: number) => {
                        setCurrentTab(index);
                      }}
                      centered={false}
                      orientation="vertical"
                      css={css`
                        width: ${tabBarWidth};
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
                    <div
                      id="groups"
                      css={css`
                        width: 600px;
                        //overflow-y: scroll; //allows us to scroll the groups without
                        //scrolling the heading tabs
                        overflow-y: auto;
                      `}>
                      {searchString ? (
                        <HighlightSearchTerms
                          searchString={searchString}
                          focussedSubPagePath={focussedSubPagePath}>
                          {props.children}
                        </HighlightSearchTerms>
                      ) : (
                        React.Children.toArray(props.children).filter(
                          (c: React.ReactNode, index: number) => index === currentTab,
                        )
                      )}
                    </div>
                  </div>
                </form>
              );
            }}
          </Formik>
        </SearchContext.Provider>
      </FocusPageContext.Provider>
    </ThemeProvider>
  );
};

// export const ConfigrGroupWrapper: React.FunctionComponent<{
//   selected: boolean;
//   // If this is true, then the selected group will get scrolled into view. Otherwise, only the selected group will be visible.
//   showAllGroups: boolean;
// }> = (props) => {
//   const groupRef = React.useRef<HTMLInputElement>(null);
//   useEffect(() => {
//     if (props.showAllGroups && props.selected) {
//       groupRef.current?.scrollIntoView();
//     }
//   }, [props.selected, props.showAllGroups]);
//   if (props.showAllGroups) {
//     return <div ref={groupRef}>{props.children}</div>;
//   } else return props.selected ? <React.Fragment>{props.children}</React.Fragment> : null;
// };

export const ConfigrGroup: React.FunctionComponent<{
  label: string;
  description?: string | React.ReactNode;
  // use hasSubgroups when this contains ConfigrSubGroups that provide their own background
  level?: undefined | 1 | 2;
}> = (props) => {
  return (
    <FilterForSearchText {...props} kids={props.children}>
      <div
        css={css`
          margin-top: 21px !important;
          margin-bottom: 12px !important;
        `}>
        <Typography variant={props.level === 2 ? 'h3' : 'h2'}>{props.label}</Typography>
        <Typography variant={'caption'}>{props.description}</Typography>
      </div>
      {props.level === 1 ? (
        <React.Fragment>{props.children}</React.Fragment>
      ) : (
        <PaperGroup>{props.children}</PaperGroup>
      )}
    </FilterForSearchText>
  );
};

const PaperGroup: React.FunctionComponent<{
  label?: string;
}> = (props) => {
  const childrenWithStore = getChildrenWithStore(props);
  return (
    <Paper
      elevation={2}
      css={css`
        width: 100%;
        margin-bottom: 12px !important;
      `}>
      <List
        component="nav"
        css={css`
          width: 100%;
        `}>
        <FilterAndJoinWithDividers>{childrenWithStore}</FilterAndJoinWithDividers>
      </List>
    </Paper>
  );
};
function getChildrenWithStore(props: React.PropsWithChildren<{}>) {
  return React.Children.map(props.children, (c, index) => {
    if (React.isValidElement(c)) {
      return React.cloneElement(c, {
        ...c.props,
      });
    } else return null;
  });
}

// For each child element, determine if we want it to be visible right now,
// and if we want to stick a horizontal divider beneath it.
export const FilterAndJoinWithDividers: React.FunctionComponent<{}> = (props) => {
  const count = React.Children.toArray(props.children).length;
  return props.children
    ? React.Children.toArray(props.children).reduce(
        (result: any, child: React.ReactNode, index: number) => {
          if (!React.isValidElement(child)) {
            throw Error('We only expect to be given full elements not, e.g., strings');
          }
          const childElement = child as ReactElement;
          const wrappedForFiltering = (
            <FilterForSubPage {...childElement.props} key={'filter' + index}>
              {childElement}
              {index < count - 1 && <Divider component="li" key={index} />}
            </FilterForSubPage>
          );
          return result.concat(wrappedForFiltering);
        },
        [],
      )
    : null;
};

export const ConfigrRowOneColumn: React.FunctionComponent<{
  label: string;
  description?: string | React.ReactNode;
  control: React.ReactNode;
}> = (props) => {
  return (
    <ListItem
      //className={'MuiListItem-alignItemsFlexStart'}
      css={css`
        flex-direction: column;
        // I don't understand why this is needed. Else, it's centered
        align-items: flex-start;
      `}>
      <ListItemText
        primaryTypographyProps={{ variant: 'h4' }}
        primary={props.label}
        secondary={props.description}
      />
      {props.control}
    </ListItem>
  );
};

// If a subPage is in effect, only render if we are part of it
const FilterForSubPage: React.FunctionComponent<{
  path: string;
}> = (props) => {
  return (
    <FocusPageContext.Consumer>
      {({ focussedSubPagePath }) => {
        if (focussedSubPagePath)
          if (
            !(
              focussedSubPagePath.startsWith(props.path) || // we are a parent of the focused thing
              // we are a child of the focused thing
              props.path.startsWith(focussedSubPagePath)
            )
          )
            return null;
        return <React.Fragment>{props.children}</React.Fragment>;
      }}
    </FocusPageContext.Consumer>
  );
};

export const ConfigrRowTwoColumns: React.FunctionComponent<{
  label: string;
  labelCss?: SerializedStyles;
  path: string;
  description?: string;
  control: React.ReactNode;
  disabled?: boolean;
  height?: string;
  onClick?: () => void;
}> = (props) => {
  const inner = (
    <SearchContext.Consumer>
      {({ searchRegEx }) => {
        const row = (
          <React.Fragment>
            {/* Left side */}
            <ListItemText
              primaryTypographyProps={{ variant: 'h4' }}
              title={props.path}
              css={css`
                color: ${props.disabled ? disabledGrey : 'unset'};
                ${props.height ? 'height:' + props.height : ''}
                user-select: none;
                * {
                  ${props.labelCss}
                }
              `}
              primary={props.label}
              secondary={
                <Typography
                  variant="caption"
                  // enhance: the default component, span, ignores the line-height of our caption
                  // but if we use p, we get a console error because the parent is already a p.body2
                  //component={'p'}
                  css={css`
                    &,
                    * {
                      max-width: calc(100% - 20px);
                    }
                  `}>
                  {props.description}
                </Typography>
              }
            />
            {/* Right side */}
            <ListItemSecondaryAction
              css={css`
                // OK, this feels like a hack. But the MUI default puts it at
                // top:50% which is fine until you have a secondary label, in
                // which case the whole thing gets very tall but really the
                // button should be top-aligned.
                top: 22px;
              `}>
              {props.control}
            </ListItemSecondaryAction>
          </React.Fragment>
        );
        if (searchRegEx) {
          const count = React.Children.toArray(props.children).filter((c) =>
            searchRegEx.exec((c as any).props.label as string),
          ).length;
          if (count) {
            return (
              <div>
                {row}
                <span
                  css={css`
                    background-color: yellow;
                  `}>
                  {`${count} matches`}
                </span>
              </div>
              // I haven't managed to get this work yet
              // <Tooltip open={true} title="hello">
              //   {row}
              // </Tooltip>
            );
          }
        }
        return row;
      }}
    </SearchContext.Consumer>
  );
  return props.onClick ? (
    <ListItemButton onClick={props.onClick}>{inner}</ListItemButton>
  ) : (
    <ListItem>{inner}</ListItem>
  );
};

// function getCheckedStateProps(props: any) {
//   return {
//     checked: props.store!.useState(props.get),
//     onChange: (e: any) =>
//       props.store!.update((s: any) => props.set(s, e.target.checked)),
//   };
// }
// function getStringStateProps(props: any) {
//   return {
//     value: props.store!.useState(props.get),
//     error: props.store!.useState(
//       props.getErrorMessage ?? ((s: any) => undefined)
//     ),
//     helperText: props.store!.useState(
//       props.getErrorMessage ?? ((s: any) => undefined)
//     ),
//     onChange: (e: any) =>
//       props.store!.update((s: any) => props.set(s, e.target.value)),
//   };
// }
export const ConfigrInput: React.FunctionComponent<{
  path: string;
  label: string;
  getErrorMessage?: (data: any) => string | undefined;
}> = (props) => {
  return (
    <ConfigrRowTwoColumns
      {...props}
      control={
        <Field component={TextField} variant="standard" name={props.path} type="text" />
      }></ConfigrRowTwoColumns>
  );
};
export const ConfigrSelect: React.FunctionComponent<{
  path: string;
  label: string;
  options: Array<{ value: string; label: string; description?: string }>;
  getErrorMessage?: (data: any) => string | undefined;
}> = (props) => {
  return (
    <ConfigrRowTwoColumns
      {...props}
      control={
        <Field
          name={props.path}
          component={FormikMuiSelect}
          sx={{ minWidth: 180 }}
          css={css`
            .MuiSelect-select {
              padding: 3px !important;
              padding-left: 9px !important;
              background-color: #f1f1f1;
            }
            * {
              border-style: none;
            }
          `}>
          {props.options.map((o) => (
            <MenuItem value={o.value} key={o.label}>
              {o.description ? (
                <Tooltip title={o.description}>
                  <span>{o.label}</span>
                </Tooltip>
              ) : (
                <span>{o.label}</span>
              )}
            </MenuItem>
          ))}
        </Field>
      }></ConfigrRowTwoColumns>
  );
};

export const ConfigrSubgroup: React.FunctionComponent<{
  label: string;
  path: string;
  getErrorMessage?: (data: any) => string | undefined;
}> = (props) => {
  return (
    <FilterForSubPage {...props}>
      <ConfigrGroup {...props} level={2}>
        {props.children}
      </ConfigrGroup>
    </FilterForSubPage>
  );
};

// In Chrome Settings, most controls live under pages that you get
// to by clicking on a right-facing triangle control. When clicked,
// the whole settings area switches to that of the page, and a back
// button, labeled with the name of the page, is shown at the top.
// We only allow a single level of nesting.
export const ConfigrSubPage: React.FunctionComponent<{
  label: string;
  labelCss?: SerializedStyles;
  path: string;
  getErrorMessage?: (data: any) => string | undefined;
}> = (props) => {
  return (
    <FocusPageContext.Consumer>
      {({ focussedSubPagePath, setFocussedSubPagePath }) => {
        if (focussedSubPagePath === props.path) {
          return (
            <React.Fragment>
              <div css={props.labelCss}>
                <IconButton onClick={() => setFocussedSubPagePath('')}>
                  <ArrowBackIcon />
                </IconButton>
                {props.label}
              </div>
              <FilterAndJoinWithDividers>{props.children}</FilterAndJoinWithDividers>
            </React.Fragment>
          );
        }
        // We are not the focussed page, so show a row with a button that would make
        // us the focussed page
        else
          return (
            <ConfigrRowTwoColumns
              onClick={() => setFocussedSubPagePath(props.path)}
              control={<ArrowRightIcon />}
              {...props}
            />
          );
      }}
    </FocusPageContext.Consumer>
  );
};

// Used to display the child component for each member of an array
// Note, this `render` function leaves it to you to take the index and build
// out the full path. I originally set out to instead just take some children elements
// and then render them using relative paths. I figured out how to do it this way sooner,
// is probably possible with a bunch of cloning so that the path prop could be changed
// to the full path that formik requires. E.g. path="./iso" could be changed to path="project.languages[0].iso"
export const ConfigrForEach: React.FunctionComponent<{
  path: string; // really, `path`
  searchTerms: string;
  render: (pathPrefix: string, index: number) => React.ReactNode;
  getErrorMessage?: (data: any) => string | undefined;
}> = (props) => {
  const { values } = useFormikContext();
  const items = getFormValueFromPath(values, props.path);
  return (
    <React.Fragment>
      {items.map((_item: any, index: number) =>
        props.render(`${props.path}[${index}]`, index),
      )}
    </React.Fragment>
  );
};

export const ConfigrBoolean: React.FunctionComponent<{
  path: string;
  label: string;
  description?: string;
  immediateEffect?: boolean;
}> = (props) => {
  const [field, meta, helpers] = useField(props.path);

  // we're not supporting indeterminate state here (yet), so treat an undefined value as false
  if (field.value === undefined || field.value === null) {
    // get a console error if we make this change while rendering
    window.setTimeout(() => helpers.setValue(false), 0);
  }
  const control = props.immediateEffect ? (
    <Field component={Switch} type="checkbox" name={props.path} label={props.label} />
  ) : (
    <Field component={Checkbox} type="checkbox" name={props.path} label={props.label} />
  );

  return (
    <ConfigrRowTwoColumns
      // clicking the row is the same as clicking the toggle control
      onClick={() => {
        helpers.setValue(!field.value);
      }}
      control={control}
      {...props}
    />
  );
};

export const ConfigrRadioGroup: React.FunctionComponent<{
  path: string;
  label: string;
}> = (props) => {
  return (
    // I could imagine wanting the radio buttons in the right column. There aren't any examples of this in chrome:settings.
    // Note that normally in chrome:settings, radios are the sole child of an entire group (e.g. "on startup", "cookie settings",
    // "safe browsing"). When the choices are short and don't need explanation, then a combobox is used instead (e.g. "Search engine")
    // But to do that, we'll have to fix some css problems (e.g. the radio doesn't know its width and so doesn't line up properly
    // on its left edge.)
    <ConfigrRowOneColumn
      {...props}
      control={<ConfigrRadioGroupRaw {...props} />}></ConfigrRowOneColumn>
  );
};
export const ConfigrRadioGroupRaw: React.FunctionComponent<{
  path: string;
  label: string;
}> = (props) => {
  const [field] = useField(props.path); // REVIEW: what are we using out of `field` in the RadioGroup below?
  return (
    <RadioGroup {...field} {...props}>
      {React.Children.map(props.children, (c) => {
        const choice = c as ReactElement<{
          label: string;
          value: string;
        }>;
        return (
          <FormControlLabel
            key={choice.props.value}
            value={choice.props.value}
            control={<Radio />}
            label={choice.props.label}
          />
        );
      })}
    </RadioGroup>
  );
};

export const ConfigrRadio: React.FunctionComponent<{
  value: any;
  label: string;
}> = (props) => {
  return (
    <React.Fragment>
      <ListItem button>
        <FormControlLabel value={props.value} control={<Radio />} label={props.label} />
      </ListItem>
    </React.Fragment>
  );
};

// Use for things like a file or folder chooser.
export const ConfigrChooserButton: React.FunctionComponent<{
  path: string;
  label: string;
  description?: string;
  buttonLabel: string;
  chooseAction: (currentValue: string) => string;
  disabled?: boolean;
}> = (props) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props.path);

  return (
    <ConfigrRowTwoColumns
      {...props}
      height="50px"
      control={
        <div
          css={css`
            height: 56px; // leave room to show th path below the button
          `}>
          <Button
            disabled={props.disabled}
            variant={'outlined'}
            onClick={() => {
              const newValue = props.chooseAction(field.value);
              setFieldValue(props.path, newValue);
            }}>
            {props.buttonLabel}
          </Button>

          <div
            css={css`
              color: ${secondaryGrey};
            `}>
            {field.value}
          </div>
        </div>
      }></ConfigrRowTwoColumns>
  );
};

// set visibility or enabled state based on provided predicates
export const ConfigrConditional: React.FunctionComponent<{
  enableWhen?: (currentValues: object) => boolean;
  visibleWhen?: (currentValues: object) => boolean;
}> = (props) => {
  const { values } = useFormikContext<object>();
  const disabled = props.enableWhen ? !props.enableWhen(values) : false;
  const visible = props.visibleWhen ? props.visibleWhen(values) : true;
  if (!visible) return null;
  return (
    <React.Fragment>
      {React.Children.map(props.children, (child) => {
        if (React.isValidElement(child)) {
          // clone in order to inject this disabled prop. It's up to the child
          // to support that prop.
          return React.cloneElement(child, { disabled: disabled });
        } else return child;
      })}
    </React.Fragment>
  );
};

/**
 * Deeply get a value from an object via its path.
 */
function getFormValueFromPath(
  obj: any,
  key: string | string[],
  def?: any,
  p: number = 0,
) {
  const path = toPath(key); // formik uses this method from lodash
  while (obj && p < path.length) {
    obj = obj[path[p++]];
  }
  return obj === undefined ? def : obj;
}
