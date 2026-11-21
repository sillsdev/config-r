import * as React from 'react';

import { styled } from '@mui/material/styles';
import { AppBar, Toolbar, Typography, InputBase, Box, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { ConfigrLocalizationContext } from './ConfigrLocalizations';
import CloseIcon from '@mui/icons-material/Close';
import { SearchContext } from './SearchContextProvider';

/* this is mostly copy/pasted from the example at https://material-ui.com/components/app-bar/#app-bar */

// Each part of the search box carries a class name that a host can style. These names are part of
// config-r's API: rename one and every host that styles it breaks. The README lists them.
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  marginLeft: 'auto',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ClearSearchButton = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: '100%',
  position: 'absolute',
  right: 0,
  top: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 4, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '20ch',
  },
}));

export const ConfigrSearchBox: React.FunctionComponent<{
  searchValue: string | null;
  setSearchString: (s: string) => void;
  // 'small' fits a host's title bar.
  size?: 'small' | 'medium';
}> = (props) => {
  const localizations = React.useContext(ConfigrLocalizationContext);
  const small = props.size === 'small';
  return (
    <Search className="configr-search-box">
      <SearchIconWrapper
        className="configr-search-icon"
        sx={small ? { padding: '0 6px' } : undefined}
      >
        <SearchIcon fontSize={small ? 'small' : 'medium'} />
      </SearchIconWrapper>
      <StyledInputBase
        sx={
          small
            ? {
                fontSize: '13px',
                fontWeight: 'normal',
                '& .MuiInputBase-input': { width: '13ch', padding: '3px 24px 3px 28px' },
              }
            : undefined
        }
        value={props.searchValue ?? ''}
        placeholder={localizations.searchLabel}
        inputProps={{
          'aria-label': localizations.searchLabel,
          className: 'configr-search-input',
        }}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
          props.setSearchString(event.target.value)
        }
      />
      {props.searchValue && (
        <ClearSearchButton
          className="configr-search-clear"
          sx={small ? { padding: '0 2px' } : undefined}
        >
          <IconButton
            aria-label={localizations.clearSearchLabel}
            color="inherit"
            size="small"
            sx={small ? { padding: '2px' } : undefined}
            onClick={() => props.setSearchString('')}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </ClearSearchButton>
      )}
    </Search>
  );
};

export const ConfigrAppBar: React.FunctionComponent<
  React.PropsWithChildren<{
    label: string;
    showSearch?: boolean;
    searchValue: string | null;
    setSearchString: (s: string) => void;
  }>
> = (props) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            {props.label}
          </Typography>
          {
            // for now we'll treat undefined as 'show it'
            props.showSearch !== false && (
              <ConfigrSearchBox
                searchValue={props.searchValue}
                setSearchString={props.setSearchString}
              />
            )
          }
        </Toolbar>
      </AppBar>
    </Box>
  );
};
