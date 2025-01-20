import { css, SerializedStyles } from '@emotion/react';
import * as React from 'react';
import { useState, ReactElement, ReactNode, useEffect } from 'react';

import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import toPath from 'lodash/toPath';

import { Field, Formik, useField, useFormikContext } from 'formik';
import {
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
  Tooltip,
  useRadioGroup,
  ToggleButton,
  InputAdornment,
} from '@mui/material';
import {
  TextField,
  Switch,
  Checkbox,
  Select as FormikMuiSelect,
  ToggleButtonGroup,
} from 'formik-mui';
import { HighlightSearchTerms } from './HighlightSearchTerms';
import { FilterForSearchText } from './FilterForSearch';
import { SearchContext } from './SearchContextProvider';

type valueGetter = () => Object;

const disabledGrey = 'rgba(5, 1, 1, 0.26)';
const secondaryGrey = 'rgba(0, 0, 0, 0.54)';

const FocusPageContext = React.createContext({
  focussedPageKey: '',
  goToPage: (p: string) => {},
  goBack: () => {},
});

const AlreadyFilteringContext = React.createContext({
  alreadyFiltering: false,
});

// TODO: should not be part of the Api
export const ContentPane: React.FunctionComponent<
  React.PropsWithChildren<{
    // this is the whole settings object that we are editing
    initialValues: object;
    currentTopLevelPageIndex?: number;
    children:
      | React.ReactElement<typeof ConfigrPage>
      | React.ReactElement<typeof ConfigrPage>[];
    setValueGetter?: (vg: valueGetter) => void;
    onChange?: (currentValues: any) => void;
  }>
> = (props) => {
  const [focussedPageKey, setFocussedPageKey] = useState('');
  React.useEffect(() => {
    const pageToFocus = React.Children.toArray(props.children).filter((c) => c)[
      props.currentTopLevelPageIndex || 0
    ];

    const pageKey = React.isValidElement(pageToFocus)
      ? pageToFocus.props?.pageKey
      : undefined;

    setFocussedPageKey(pageKey);
  }, [props.children, props.currentTopLevelPageIndex]);

  const valuesToReportRef = React.useRef(props.initialValues);

  const valuesToReportJsonRef = React.useRef(JSON.stringify(props.initialValues));

  const onChangeWrapper = (newValues: any) => {
    if (!props.onChange) return;

    let valueToReport = newValues;
    if (valueToReport[kOverrideValuePrefix]) {
      // Note: this is a shallow clone which means after the top level it's pointing to
      // the original objects. This is fine, because we're only going to use it to remove
      // a single property from the top level.
      valueToReport = { ...newValues };
      delete valueToReport[kOverrideValuePrefix];
    }
    // Note: If we start using text inputs, we wonder if the speed of this could
    // become a problem as it will be stringifying the whole object on every keystroke.
    // But this is a common strategy for solving this "did something really change"
    // problem in react. If it were a problem we could perhaps switch to onBlur
    // instead of onChange for ConfigrInput with text.
    const newStringValues = JSON.stringify(valueToReport);
    // It's very important that we don't call onChange with a new cloned
    // object each time, or we're likely to get into an infinite loop of re-renders,
    // as some parent re-renders this whole component when its settings state changes.
    // So we use the two ref objects to make sure we pass the same instance each time
    // unless the JSON has changed.
    // This also allows us to avoid calling onChange at all if nothing has changed.
    if (newStringValues === valuesToReportJsonRef.current) return;
    valuesToReportJsonRef.current = newStringValues;
    valuesToReportRef.current = valueToReport;
    props.onChange(valuesToReportRef.current);
  };

  const goBack = () => {
    setPageHistoryStack(pageHistoryStack.slice(0, -1));
    setFocussedPageKey(pageHistoryStack[pageHistoryStack.length - 1]);
  };
  const [pageHistoryStack, setPageHistoryStack] = useState<string[]>([]);
  const getTopLevelPages = () => {
    return React.Children.map(props.children, (child: any) => {
      if (child && child.type === ConfigrPage)
        return React.cloneElement(child, { topLevel: true });
      else return null;
    }).filter((c: any) => c);
  };
  const goToPage = (pageKey: string) => {
    setPageHistoryStack([...pageHistoryStack, focussedPageKey]);
    setFocussedPageKey(pageKey);
  };

  return (
    <FocusPageContext.Provider
      value={{
        focussedPageKey,
        goToPage,
        goBack,
      }}
    >
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

          onChangeWrapper(values);

          return (
            <form
              onSubmit={handleSubmit}
              css={css`
                flex-grow: 1;
              `}
            >
              <SearchContext.Consumer>
                {({ searchString }) => {
                  if (searchString) {
                    return (
                      // This doesn't do any filtering, it just highlights matching things that something else is choosing to show.
                      <HighlightSearchTerms
                        searchString={searchString}
                        focussedPageKey={focussedPageKey}
                      >
                        {getTopLevelPages()}
                      </HighlightSearchTerms>
                    );
                  } else {
                    return getTopLevelPages();
                  }
                }}
              </SearchContext.Consumer>
            </form>
          );
        }}
      </Formik>
    </FocusPageContext.Provider>
  );
};

// const VisibleGroups: React.FunctionComponent<
//   React.PropsWithChildren<{
//     currentGroup?: number;
//     focussedPageKey?: string;
//     children:
//       | React.ReactElement<typeof InternalGroup>
//       | React.ReactElement<typeof InternalGroup>[];
//   }>
// > = (props) => {
//   return (
//     <SearchContext.Consumer>
//       {({ searchString }) => {
//         return (
//           <div
//             id="groups"
//             css={css`
//               //overflow-y: scroll; //allows us to scroll the groups without
//               //scrolling the heading tabs
//               overflow-y: auto;
//             `}
//           >
//             {searchString ? (
//               <HighlightSearchTerms
//                 searchString={searchString}
//                 focussedPageKey={props.focussedPageKey}
//               >
//                 {React.Children.toArray(props.children).filter((c) => c)}
//               </HighlightSearchTerms>
//             ) : (
//               React.Children.toArray(props.children).filter(
//                 (c: React.ReactNode, index: number) => c && index === props.currentGroup,
//               )
//             )}
//           </div>
//         );
//       }}
//     </SearchContext.Consumer>
//   );
// };

const BoxOfRows: React.FunctionComponent<
  React.PropsWithChildren<{
    label?: string;
    inFocussedPage?: boolean;
  }>
> = (props) => {
  if (props.inFocussedPage) {
    console.log(
      'RowCluster infocus' + 'children:' + React.Children.count(props.children),
    );

    // count the number that we will actually show
    const count = React.Children.toArray(props.children).filter((c) => c).length;
    return (
      <Paper
        // className="indentIfInSubPage"
        elevation={2}
        css={css`
          //width: 100%; doesn't work with shadow
          margin-left: 2px; //needed to show shadow
          margin-right: 2px; //needed to show shadow
          margin-bottom: 12px !important;
        `}
      >
        <List
          component="nav"
          css={css`
            width: calc(100% - 20px);
          `}
        >
          {/* return clones of our children with our props.inFocussedPage */}
          {React.Children.map(props.children, (child: any, index: number) => {
            if (!child) return null;
            return (
              <>
                {React.cloneElement(child, { inFocussedPage: true })}
                {index < count - 1 && (
                  <Divider component="li" key={'divider' + index.toString()} />
                )}
              </>
            );
          })?.filter((c: any) => c)}
        </List>
      </Paper>
    );
  } else {
    // So we aren't part of the active page, but maybe that page is a descendant of ours
    // Keep only the children that could contain that page (ConfigrPage || ConfigrForEach).
    return (
      <>
        {React.Children.map(props.children, (child: any) => {
          if ((child && child?.type === ConfigrPage) || child?.type === ConfigrForEach)
            return child;
          else return null;
        }).filter((c: any) => c)}
      </>
    );
  }
};

// For each child element, determine if we want it to be visible right now,
// and if we want to stick a horizontal divider beneath it.
// const FilterAndJoinWithDividers: React.FunctionComponent<
//   React.PropsWithChildren<{ pageKey?: string }>
// > = (props) => {
//   const count = React.Children.toArray(props.children).length;
//   //return <h1>{`FilterAndJoinWithDividers props.pageKey='${props.pageKey}'`}</h1>;
//   //console.log(`<FilterAndJoinWithDividers pageKey='${props.pageKey}>`);
//   return props.children
//     ? React.Children.toArray(props.children).reduce(
//         (result: any, child: React.ReactNode, index: number) => {
//           if (!React.isValidElement(child)) {
//             throw Error('We only expect to be given full elements not, e.g., strings');
//           }
//           const childElement = child as ReactElement;
//           const wrappedForFiltering = (
//             <FilterForSubPage {...childElement.props} key={'filter' + index}>
//               {childElement}
//               {index < count - 1 && <Divider component="li" key={index} />}
//             </FilterForSubPage>
//           );
//           return result.concat(wrappedForFiltering);
//         },
//         [],
//       )
//     : null;
// };

const ConfigrRowOneColumn: React.FunctionComponent<
  React.PropsWithChildren<{
    label: string;
    description?: string | React.ReactNode;
    control: React.ReactNode;
  }>
> = (props) => {
  return (
    <ListItem
      //className={'MuiListItem-alignItemsFlexStart'}
      css={css`
        flex-direction: column;
        // I don't understand why this is needed. Else, it's centered
        align-items: flex-start;
      `}
    >
      <ListItemText
        primaryTypographyProps={{ variant: 'h4' }}
        primary={props.label}
        secondary={descriptionToReact(props.description)}
      />
      {props.control}
    </ListItem>
  );
};

// If a subPage is in effect, only render if we are part of it
/*const FilterForSubPage: React.FunctionComponent<React.PropsWithChildren<{}>> = (
  props,
) => {
  return (
    <AlreadyFilteringContext.Consumer>
      {({ alreadyFiltering }) => {
        if (alreadyFiltering) return props.children;
        else
          return (
            <AlreadyFilteringContext.Provider value={{ alreadyFiltering: true }}>
              <FocusPageContext.Consumer>
                {({ focussedPageKey }) => {
                  //console.log(`<FilterForSubPage> focussedPageKey='${focussedPageKey}'`);

                  if (!focussedPageKey)
                    return <React.Fragment>{props.children}</React.Fragment>;
                  return (
                    <React.Fragment>
                      {React.Children.map(props.children, (child: any) => {
                        // console.log(
                        //   `FilterForSubPage child ${child.props.label} with path=${child.props.path}} with pageKey=${child.props.pageKey}`,
                        // );
                        if (child && child.props.pageKey === focussedPageKey) {
                          return child;
                        }
                        // now return any children of the child that are in the subPage
                        if (child && child.props.children) {
                          return React.Children.map(
                            child.props.children,
                            (grandchild: any) => {
                              if (
                                grandchild &&
                                grandchild.props.pageKey === focussedPageKey
                              ) {
                                return grandchild;
                              }
                            },
                          );
                        }
                        return null;
                      })}
                    </React.Fragment>
                  );
                }}
              </FocusPageContext.Consumer>
            </AlreadyFilteringContext.Provider>
          );
      }}
    </AlreadyFilteringContext.Consumer>
  );
};
*/
type StringEditorComponent = React.FunctionComponent<{
  value: string;
  onChange: (value: string) => void;
}>;
type BooleanEditorComponent = React.FunctionComponent<{
  value: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}>;

const ConfigrRowTwoColumns: React.FunctionComponent<
  React.PropsWithChildren<{
    label: string;
    labelCss?: SerializedStyles;
    path: string; //TODO: change this to "key"? It's not used as a path.
    description?: string;
    control: React.ReactElement;
    disabled?: boolean;
    height?: string;
    indented?: boolean;
    onClick?: () => void;
  }>
> = (props) => {
  const inner = (
    <SearchContext.Consumer>
      {({ searchRegEx }) => {
        const row = (
          <div
            css={css`
              display: flex;
              flex-direction: column;
              width: 100%;
            `}
          >
            {/* Left side */}
            <ListItemText
              primaryTypographyProps={{ variant: 'h4' }}
              title={props.path}
              css={css`
                /* no: doing this ends up double-fading the label
                    color: ${props.disabled ? disabledGrey : 'unset'}; */
                ${props.height ? 'height:' + props.height : ''}
                ${props.indented && 'margin-left: 30px;'}
                user-select: none;
                * {
                  ${props.labelCss}
                }
              `}
              primary={props.label}
            />
            {/* Right side */}
            <ListItemSecondaryAction
              css={css`
                // OK, this feels like a hack. But the MUI default puts it at
                // top:50% which is fine until you have a secondary label, in
                // which case the whole thing gets very tall but really the
                // button should be top-aligned.
                /// Months later.. but it messed up toggleGroups and I'm not seeing the problem it was solving, at the moment.
                //top: 22px;
              `}
            >
              {props.control}
            </ListItemSecondaryAction>
            <Typography
              variant="caption"
              // enhance: the default component, span, ignores the line-height of our caption
              // but if we use p, we get a console error because the parent is already a p.body2
              //component={'p'}
              css={css`
                &,
                * {
                  // this is a hack... we need to figured out how to have this MUI List stuff allow a text along the bottom
                  max-width: calc(100% - 200px);
                  color: ${props.disabled ? disabledGrey : 'unset'};
                }
              `}
            >
              {descriptionToReact(props.description)}
            </Typography>
          </div>
        );
        if (searchRegEx) {
          const count = React.Children.toArray(props.children).filter(
            (c) => c && searchRegEx.exec((c as any).props.label as string),
          ).length;
          if (count) {
            return (
              // I haven't managed to get this work yet
              // <Tooltip open={true} title="hello">
              //   {row}
              // </Tooltip>
              <div>
                {row}
                <span
                  css={css`
                    background-color: yellow;
                  `}
                >
                  {`${count} matches`}
                </span>
              </div>
            );
          }
        }
        return row;
      }}
    </SearchContext.Consumer>
  );
  return props.onClick ? (
    <ListItemButton onClick={props.onClick} disabled={props.disabled}>
      {inner}
    </ListItemButton>
  ) : (
    <ListItem
      css={css`
        height: ${props.height};
      `}
    >
      {inner}
    </ListItem>
  );
};

// Properties that are common to (nearly?) all Configr leaf controls.
// In particular useoverrideValue manipulates path and disabled to implement
// the overrideValue feature. The others are just included here so we don't
// have to repeat them on each control.
interface IConfigrProps<T> {
  path: string;
  label: string;
  description?: string;
  disabled?: boolean;
  // If overrideValue is set, then the control is disabled, and the value shown
  // is based on overrideValue rather then the value indicated by the path.
  // The value in the main settings object is not affected and may be different from
  // the value determined by overrideValue and shown in the control.
  overrideValue?: T;
  // explain why it is over-ridden
  overrideDescription?: string;
  pageKey?: string;
}

// This hook implements the overrideValue prop. It does this by putting
// the override value into temporary property and setting the path to
// point to it. The control is then disabled, so we end up with a
// disabled control that shows the override value.
// It takes your props and gives you a replacement.
function useModifyForOverride<T>(props: IConfigrProps<T>): IConfigrProps<T> {
  // We don't need this if we're not using overrideValue, but the rules of hooks
  // won't let us call it conditionally.
  const { values } = useFormikContext();
  if (props.overrideValue === undefined) return props;

  // Something elsewhere in configr treats dot and square brackets specially,
  // as paths into child objects and arrays. If we leave them in, then the
  // code won't find a overrideValue that just uses the whole path as a prop name.
  // So we replace them with underscores.
  const disabledPath = props.path.replace(/[.[\]]/g, '_');

  let overrideValues = (values as any)[kOverrideValuePrefix];
  if (!(values as any)[kOverrideValuePrefix]) {
    // this is the first overrideValue we've seen, so create a place to put them
    (values as any)[kOverrideValuePrefix] = overrideValues = {};
  }
  // Note: We're modifying an object that is part of the formik state, which might
  // be a sketchy thing to do. But the thing we're adding is unlikely
  // to be noticed by any other code, and it works.
  // If we decide this is unacceptable, the only other idea I've had is to pass
  // a list of overrideValue paths to the ContentPane, and have it modify the
  // initialValues object before passing it to Formik.
  overrideValues[disabledPath] = props.overrideValue;

  const description = `${props.description ?? ''} (${props.overrideDescription ?? ''})`
    .replace(' ()', '')
    .trim();

  return {
    ...props,
    description,
    disabled: true,
    path: kOverrideValuePrefix + '.' + disabledPath,
  };
}

const kOverrideValuePrefix = 'overrideValue$';

// Note: string|number covers 'text' | 'number' | 'email' but may need to be extended if we support other types.

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
// TODO: the spinner control isn't visually disabling correctly (but nothing happens when you click it)
export const ConfigrInput: React.FunctionComponent<
  React.PropsWithChildren<
    IConfigrProps<string | number> & {
      className?: string;
      type?: 'text' | 'number' | 'email'; // I don't really know what all the options are in formik
      units?: string;
      getErrorMessage?: (data: any) => string | undefined;
    }
  >
> = (props) => {
  props = useModifyForOverride(props);
  return (
    <ConfigrRowTwoColumns
      {...props}
      control={
        <Field
          component={TextField}
          variant="standard"
          name={props.path}
          type={props.type ?? 'text'} // type "number" gives you a spinner control
          InputProps={
            props.units
              ? {
                  endAdornment: (
                    <InputAdornment position="end">{props.units}</InputAdornment>
                  ),
                }
              : undefined
          }
          css={css`
            input {
              text-align: end;
            }
          `}
          //className={props.className}
        />
      }
    ></ConfigrRowTwoColumns>
  );
};

interface ICustomStringInputProps extends IConfigrProps<string> {
  control: React.FunctionComponent<{
    value: string;
    disabled?: boolean;
    onChange: (value: string) => void;
  }>;
  getErrorMessage?: (data: any) => string | undefined;
}

// Clients can use this to create their own custom inputs based on string data.
// For example, <DefaultColorPicker> or some other color picker.
export const ConfigrCustomStringInput: React.FunctionComponent<
  React.PropsWithChildren<ICustomStringInputProps>
> = (props) => {
  props = useModifyForOverride(props) as ICustomStringInputProps;
  const [field, meta, helpers] = useField(props.path);
  const { value } = meta;
  const { setValue } = helpers;

  return (
    <ConfigrRowTwoColumns
      {...props}
      control={
        <props.control disabled={props.disabled} value={value} onChange={setValue} />
      }
    ></ConfigrRowTwoColumns>
  );
};

interface ICustomBooleanInputProps extends IConfigrProps<boolean> {
  control: BooleanEditorComponent;
  getErrorMessage?: (data: any) => string | undefined;
}

// Clients can use this to create their own custom inputs based on boolean data.
// Note, this is untested, but based on ConfigrCustomStringInput which is tested.
export const ConfigrCustomBooleanInput: React.FunctionComponent<
  React.PropsWithChildren<ICustomBooleanInputProps>
> = (props) => {
  props = useModifyForOverride(props) as ICustomBooleanInputProps;
  const [field, meta, helpers] = useField(props.path);
  const { value } = meta;
  const { setValue } = helpers;

  return (
    <ConfigrRowTwoColumns
      {...props}
      control={
        <props.control disabled={props.disabled} value={value} onChange={setValue} />
      }
    ></ConfigrRowTwoColumns>
  );
};

interface ICustomNumberInputProps extends IConfigrProps<number> {
  control: React.FunctionComponent<
    React.PropsWithChildren<{
      value: number;
      disabled?: boolean;
      onChange: (value: number) => void;
    }>
  >;
  getErrorMessage?: (data: any) => string | undefined;
}

// Clients can use this to create their own custom inputs based on number data.
// Note, this is untested, but based on ConfigrCustomStringInput which is tested.
export const ConfigrCustomNumberInput: React.FunctionComponent<
  React.PropsWithChildren<ICustomNumberInputProps>
> = (props) => {
  props = useModifyForOverride(props) as ICustomNumberInputProps;
  const [field, meta, helpers] = useField(props.path);
  const { value } = meta;
  const { setValue } = helpers;

  return (
    <ConfigrRowTwoColumns
      {...props}
      control={
        <props.control disabled={props.disabled} value={value} onChange={setValue} />
      }
    ></ConfigrRowTwoColumns>
  );
};

interface ICustomObjectInputProps<T> extends IConfigrProps<unknown> {
  control: React.FunctionComponent<
    React.PropsWithChildren<{
      value: T;
      disabled?: boolean;
      onChange: (value: T) => void;
    }>
  >;
  getErrorMessage?: (data: any) => string | undefined;
}

// Clients can use this to create their own custom inputs based on object data.
// Note, this is untested, but based on ConfigrCustomStringInput which is tested.
export function ConfigrCustomObjectInput<T>(
  props: React.PropsWithChildren<ICustomObjectInputProps<T>>,
) {
  props = useModifyForOverride(props) as ICustomObjectInputProps<T>;
  const [field, meta, helpers] = useField(props.path);
  const { value } = meta;
  const { setValue } = helpers;

  return (
    <ConfigrRowTwoColumns
      {...props}
      control={
        <props.control value={value} disabled={props.disabled} onChange={setValue} />
      }
    ></ConfigrRowTwoColumns>
  );
}

interface ISelectProps extends IConfigrProps<string> {
  indented?: boolean;
  options: Array<{ value: string; label?: string; description?: string } | number>;
  enableWhen?: string | ((currentValues: object) => boolean);
  getErrorMessage?: (data: any) => string | undefined;
}

export const ConfigrSelect: React.FunctionComponent<
  React.PropsWithChildren<ISelectProps>
> = (props) => {
  props = useModifyForOverride(props) as ISelectProps;
  const disabled = props.disabled || !useBooleanBasedOnValues(true, props.enableWhen);
  return (
    <ConfigrRowTwoColumns
      {...props}
      disabled={disabled}
      control={
        <Field
          name={props.path}
          disabled={disabled}
          component={FormikMuiSelect}
          // defaultValue and displayEmpty together allow the props.options to contain a {`value:""`, label:"default"} option
          // that will show if the value is undefined.
          // Note that none of the options has this empty string value, that's ok, the control will just not show any selected item.
          // This does not cause the resulting data to have an empty string, it will still be undefined. Ths is true even
          // if an empty string option is provided. The only way it gets set to empty string is if the user selected a different
          // option, and then moved back to the default. What we'd like to do at that point might be to set it back to undefined,
          // but we don't have that capability yet. So at this point, if you can't handle a value of empty string in the output,
          // don't provide an option that has empty string as a value. Or massage the data after it comes back.
          defaultValue={''}
          displayEmpty={true}
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
          `}
        >
          {/* Allow a list of numbers (typically font sizes) instead of label/value objects */}
          {props.options.map((o) => {
            if (typeof o === 'number') {
              return (
                <MenuItem value={o} key={o}>
                  <span>{o}</span>
                </MenuItem>
              );
            }
            const labelToUse = o.label ?? o.value;
            const valueToUse = o.value ?? o.label;
            if (labelToUse?.startsWith('--')) {
              return <Divider key={labelToUse} />;
            }
            return (
              <MenuItem value={valueToUse} key={labelToUse}>
                {o.description ? (
                  <Tooltip title={o.description}>
                    <span>{labelToUse}</span>
                  </Tooltip>
                ) : (
                  <span>{labelToUse}</span>
                )}
              </MenuItem>
            );
          })}
        </Field>
      }
    ></ConfigrRowTwoColumns>
  );
};

// this is typically used to an message, e.g. explaining something about hte page or why a group is disabled.
export const ConfigrStatic: React.FunctionComponent<
  React.PropsWithChildren<{
    // FOR NOW we aren't supporting searcing on these
    // searchTerms?: string;
    // description?: string | React.ReactNode;
    // getErrorMessage?: (data: any) => string | undefined;
    // inFocussedPage?: boolean;
  }>
> = (props) => {
  return <>{props.children}</>;
};

export const ConfigrGroup: React.FunctionComponent<
  React.PropsWithChildren<{
    label?: string;
    searchTerms?: string;
    description?: string | React.ReactNode;
    getErrorMessage?: (data: any) => string | undefined;
    inFocussedPage?: boolean;
  }>
> = (props) => {
  //console.log(`configrgroup pageKey='${props.pageKey}'`);

  // TODO: after the reorg to allow sub page hierarchy to be independent of data hierarchy, we have yet to
  // TODO: re-install the search filter that shows a set of items (not sure what level) that match the search term.

  return (
    <>
      {props.inFocussedPage && props.label && (
        <Typography variant="h3">{props.label}</Typography>
      )}
      <BoxOfRows {...props}>{props.children}</BoxOfRows>
    </>
  );

  // <FilterForSearchText {...props} kids={props.children}>
  //   <div
  //     className="indentIfInSubPage"
  //     css={css`
  //       //margin-top: 21px !important;
  //       margin-bottom: 12px !important;
  //     `}
  //   >
  //     {props.label && (
  //       <Typography variant={props.level === 2 ? 'h3' : 'h2'}>{props.label}</Typography>
  //     )}
  //     <Typography variant={'caption'}>
  //       {descriptionToReact(props.description)}
  //     </Typography>
  //   </div>
  //   {!props.level || props.level <RowCluster 2 ? (
  //     <div className="indentIfInSubPage">{props.children}</div>
  //   ) : (
  //     <RowCluster>{props.children}</RowCluster>
  //   )}
  // </FilterForSearchText>
};

export type PageChild =
  | React.ReactElement<typeof ConfigrGroup>
  | false // it's hard to avoid this stuff, e.g. if they conditionally show a group;
  | undefined
  | null;

// In Chrome Settings, most controls live under pages that you get
// to by clicking on a right-facing triangle control. When clicked,
// the whole settings area switches to that of the page, and a back
// button, labeled with the name of the page, is shown at the top.
// We only allow a single level of nesting.
export const ConfigrPage: React.FunctionComponent<
  React.PropsWithChildren<{
    label: string;
    labelCss?: SerializedStyles;
    //path: string;
    pageKey: string; // making this mandatory because it's not clear what you're doing wrong when you omit it and see multiple pages at once
    searchTerms?: string;
    topLevel?: boolean; // NB: not a for public API.
    getErrorMessage?: (data: any) => string | undefined;
    inFocussedPage?: boolean;
    children: PageChild | PageChild[];
  }>
> = (props) => {
  const key = props.pageKey || props.label; // REVIEW. Shall we just remove pageKey?

  const childOfWrongType = React.Children.toArray(props.children).find(
    (child: any) =>
      child &&
      child.type !== ConfigrGroup &&
      child.type !== ConfigrForEach &&
      child.type !== ConfigrStatic,
  );
  if (childOfWrongType) {
    throw Error(
      `<ConfigrPage pageKey='${key}'> ConfigrPage children must be of type ConfigrGroup, ConfigrForEach, or ConfigrMessage. Label of offending element is "${
        (childOfWrongType as any).props?.label
      }"`,
    );
  }
  return (
    <FocusPageContext.Consumer>
      {({ focussedPageKey, goToPage, goBack }) => {
        console.log(
          `<ConfigrPage pageKey='${key}' inFocussedPage=${props.inFocussedPage} focussedPageKey='${focussedPageKey}'>`,
        );
        if (props.inFocussedPage) {
          // We are in the focussed page, so the button that would activate us can be visible.
          // Show a row with a button that would make us the current page.
          return (
            <ConfigrRowTwoColumns
              path={key}
              onClick={() => goToPage(key)}
              control={<ArrowRightIcon />}
              {...props}
            />
          );
        }
        // are we the page that should take focus?
        if (focussedPageKey === props.pageKey) {
          return (
            <>
              {!props.topLevel && (
                <div css={props.labelCss}>
                  <IconButton onClick={() => goBack()}>
                    <ArrowBackIcon />{' '}
                    <Typography variant={'h4'} component="span">
                      {props.label}
                    </Typography>
                  </IconButton>
                </div>
              )}
              {props.topLevel && props.label && (
                <Typography
                  variant={'h2'}
                  css={css`
                    margin-bottom: 0.5em;
                  `}
                >
                  {props.label}
                </Typography>
              )}
              <div
                css={css`
                  /* .indentIfInSubPage {
                    margin-left: 20px;
                    //margin-right: 20px;
                  } */
                  display: flex;
                  flex-direction: column;
                  gap: 0.5em;
                `}
              >
                {/* <FilterAndJoinWithDividers pageKey={props.pageKey}> */}
                {/* review */}
                {React.Children.map(props.children, (child) => {
                  if (child) {
                    //console.log(`giving child pageKey ${props.pageKey}`);
                    // we have to do this prop drilling because React Contexts can't be created recursively
                    return React.cloneElement(child as any, {
                      inFocussedPage: true,
                    });
                  } else return null;
                })?.filter((c) => c)}
                {/* </FilterAndJoinWithDividers> */}
              </div>
            </>
          );
        } else {
          // traverse children that can contain pages so we should search down them looking for current page
          // these will not add anything to the UI except the page we're looking for, if they have it.
          return (
            <React.Fragment>
              {React.Children.map(props.children, (child) => {
                if (
                  (child && (child as any).type === ConfigrGroup) ||
                  (child && (child as any).type === ConfigrForEach)
                ) {
                  return child;
                } else return null;
              })?.filter((c) => c)}
            </React.Fragment>
          );
        }
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
export const ConfigrForEach: React.FunctionComponent<
  React.PropsWithChildren<{
    path: string; // really, `path`
    searchTerms: string;
    inFocussedPage?: boolean; // is unknown initially but the actual instance that gets rendered has a value that is prop-drilled down from the parent ConfigrPage
    render: (pathPrefix: string, index: number) => React.ReactNode;
    getErrorMessage?: (data: any) => string | undefined;
  }>
> = (props) => {
  const { values } = useFormikContext();
  const items = getFormValueFromPath(values, props.path);
  return (
    <React.Fragment>
      {items.map((_item: any, index: number) => {
        const item = props.render(`${props.path}[${index}]`, index);
        // now clone and prop-drill in inFocussedPage
        const cloned = React.cloneElement(item as any, {
          inFocussedPage: props.inFocussedPage,
        });
        return cloned;
      })}
    </React.Fragment>
  );
};

export const ConfigrBoolean: React.FunctionComponent<
  React.PropsWithChildren<
    IConfigrProps<boolean> & {
      // When immediateEffect is true, overrideValue will
      // misbehave: the control will seem to work but not actually save the setting.
      immediateEffect?: boolean;
      // When true, the control will be disabled, but the label will not be greyed out, only the checkbox.
      // This is useful when the checkbox is one of a set and is disabled because it is the only one that
      // is turned on; in that case, it should not look less prominent than the others.
      locked?: boolean;
    }
  >
> = (props) => {
  props = useModifyForOverride(props);
  const [field, meta, helpers] = useField(props.path);

  // we're not supporting indeterminate state here (yet), so treat an undefined value as false
  if (field.value === undefined || field.value === null) {
    // get a console error if we make this change while rendering
    window.setTimeout(() => helpers.setValue(false), 0);
  }
  const control = props.immediateEffect ? (
    <Field
      component={Switch}
      type="checkbox"
      name={props.path}
      label={props.label}
      disabled={props.disabled || props.locked}
    />
  ) : (
    <Field
      component={Checkbox}
      type="checkbox"
      disabled={props.disabled || props.locked}
      name={props.path}
      label={props.label}
    />
  );

  return (
    <ConfigrRowTwoColumns
      // clicking the row is the same as clicking the toggle control
      onClick={() => {
        // if locked, we can't change the value, but we didn't tell the component it is disabled
        // so we still get the click.
        if (props.locked) return;
        helpers.setValue(!field.value);
      }}
      control={control}
      {...props}
      // If it is locked, we want it to BE disabled but not LOOK disabled (the checkbox is
      // the control above, and will LOOK disabled for either disabled or locked or both).
      // Note that the label will still BE disabled since we ignore clicks (above) if locked.
      // Here, we want disabled to be false if locked, even if disabled is also true,
      // so we get the undimmed label.
      disabled={props.disabled && !props.locked}
    />
  );
};

interface IRadioGroupProps extends IConfigrProps<string> {
  row?: boolean;
}

// TODO: overrideValue sets the value and prevents changing the value, but we
// don't yet have CSS to make the whole group LOOK disabled.
export const ConfigrRadioGroup: React.FunctionComponent<
  React.PropsWithChildren<IRadioGroupProps>
> = (props) => {
  props = useModifyForOverride(props) as IRadioGroupProps;
  return (
    // I could imagine wanting the radio buttons in the right column. There aren't any examples of this in chrome:settings.
    // Note that normally in chrome:settings, radios are the sole child of an entire group (e.g. "on startup", "cookie settings",
    // "safe browsing"). When the choices are short and don't need explanation, then a combobox is used instead (e.g. "Search engine")
    // But to do that, we'll have to fix some css problems (e.g. the radio doesn't know its width and so doesn't line up properly
    // on its left edge.)
    <ConfigrRowOneColumn
      {...props}
      control={<ConfigrRadioGroupRaw {...props} />}
    ></ConfigrRowOneColumn>
  );
};

const ConfigrRadioGroupRaw: React.FunctionComponent<
  React.PropsWithChildren<{
    path: string;
    label: string;
    row?: boolean;
    description?: string;
    disabled?: boolean;
  }>
> = (props) => {
  // Enhance: it's not clear what are we using out of `field` in the RadioGroup below. Probably onchange, value
  const [field] = useField(props.path);
  return (
    <RadioGroup row={props.row} {...field} {...props}>
      {props.children}
    </RadioGroup>
  );
};

export const ConfigrRadio: React.FunctionComponent<
  React.PropsWithChildren<{
    value: any;
    label?: string; // either include a label or a single child
  }>
> = (props) => {
  const radioContext = useRadioGroup();
  console.log('useRadioGroup ' + JSON.stringify(radioContext));
  if (props.label) {
    return (
      <FormControlLabel value={props.value} control={<Radio />} label={props.label} />
    );
  } else {
    return <React.Fragment>{props.children}</React.Fragment>;
  }
};

interface IToggleGroupProps extends IConfigrProps<string> {
  row?: boolean;
  height?: string;
}

export const ConfigrToggleGroup: React.FunctionComponent<
  React.PropsWithChildren<IToggleGroupProps>
> = (props) => {
  props = useModifyForOverride(props) as IToggleGroupProps;
  return (
    <ConfigrRowTwoColumns
      {...props}
      control={<ConfigrToggleGroupRaw {...props} />}
    ></ConfigrRowTwoColumns>
  );
};

const ConfigrToggleGroupRaw: React.FunctionComponent<
  React.PropsWithChildren<{
    path: string;
    label: string;
    row?: boolean;
    height?: string;
    description?: string;
    disabled?: boolean;
  }>
> = (props) => {
  return (
    <Field component={ToggleButtonGroup} name={props.path} type="checkbox" exclusive>
      {props.children}
    </Field>
  );
};

// This cannot be a React.FunctionComponent because then the ToggleGroup stops working.
// So we have to transparently just return the ToggleButton
export function ConfigrMakeToggle(value: any, content: ReactNode) {
  return <ToggleButton value={value}>{content}</ToggleButton>;
}

interface IChooserButtonProps extends IConfigrProps<string> {
  buttonLabel: string;
  chooseAction: (currentValue: string) => string;
}

// Use for things like a file or folder chooser.
export const ConfigrChooserButton: React.FunctionComponent<
  React.PropsWithChildren<
    IConfigrProps<string> & {
      buttonLabel: string;
      chooseAction: (currentValue: string) => string;
    }
  >
> = (props) => {
  props = useModifyForOverride(props) as IChooserButtonProps;
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props.path);

  return (
    <ConfigrRowTwoColumns
      {...props}
      height="50px"
      control={
        <div
          css={css`
            height: 56px; // leave room to show the path below the button
          `}
        >
          <Button
            disabled={props.disabled}
            variant={'outlined'}
            onClick={() => {
              const newValue = props.chooseAction(field.value);
              setFieldValue(props.path, newValue);
            }}
          >
            {props.buttonLabel}
          </Button>

          <div
            css={css`
              color: ${secondaryGrey};
            `}
          >
            {field.value}
          </div>
        </div>
      }
    ></ConfigrRowTwoColumns>
  );
};

// set visibility or enabled state based on provided predicates
export const ConfigrConditional: React.FunctionComponent<
  React.PropsWithChildren<{
    enableWhen?: (currentValues: object) => boolean;
    visibleWhen?: (currentValues: object) => boolean;
  }>
> = (props) => {
  const [children, setChildren] = useState<React.ReactNode[]>([]);
  useEffect(() => {
    setChildren(React.Children.toArray(props.children).filter((c) => c));
  }, [props.children]);
  const { values } = useFormikContext<object>();
  const disabled = props.enableWhen ? !props.enableWhen(values) : false;
  const visible = props.visibleWhen ? props.visibleWhen(values) : true;
  if (!visible) return null;
  return (
    <React.Fragment>
      {React.Children.map(
        children as React.ReactElement<{ disabled: boolean }>[],
        (child: React.ReactElement<{ disabled: boolean }>) => {
          if (React.isValidElement(child)) {
            // clone in order to inject this disabled prop. It's up to the child
            // to support that prop.
            return React.cloneElement(child, { disabled: disabled });
          } else return child;
        },
      )}
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

function useBooleanBasedOnValues(
  defaultResult: boolean,
  functionOrPath?: ((currentValues: object) => boolean) | string,
): boolean {
  const { values } = useFormikContext<object>();
  if (!functionOrPath) return defaultResult;
  if (typeof functionOrPath === 'string') {
    return getFormValueFromPath(values, functionOrPath) === true;
  } else {
    return functionOrPath(values);
  }
}

function isParent(parentPath: string, childPath: string): boolean {
  // yes: start.font, start.font.feature
  // no: start.font, start.fontfeature
  return childPath.startsWith(parentPath + '.');
}

function descriptionToReact(description?: string | React.ReactNode) {
  if (!description) return null;
  if (typeof description !== 'string') return description; //nothing to do

  // detect markdown links and make them clickable
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let m;
  let lastEnd = 0;
  const result = [];
  while ((m = re.exec(description)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === re.lastIndex) {
      re.lastIndex++;
    }
    result.push(description.substring(lastEnd, m.index));
    result.push(
      <a href={m[2]} target="_blank" rel="noreferrer">
        {m[1]}
      </a>,
    );
    lastEnd = re.lastIndex;
  }
  result.push(description.substring(lastEnd));
  return result;
}
