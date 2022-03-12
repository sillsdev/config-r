import React from 'react';

import { makeStyles } from '@mui/styles';
import { alpha, styled, Theme } from '@mui/material/styles';
import { AppBar, Toolbar, Typography, InputBase, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { SearchContext } from './SearchContextProvider';

/* this is mostly copy/pasted from the example at https://material-ui.com/components/app-bar/#app-bar */

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
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

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));
export const ConfigrAppBar: React.FunctionComponent<{
  label: string;
  searchValue: string | null;
  setSearchString: (s: string) => void;
}> = (props) => {
  console.log('Rendering appbar. searchValue=' + props.searchValue);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            {props.label}
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              value={props.searchValue ?? ''}
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              onChange={(
                event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
              ) => props.setSearchString(event.target.value)}
            />
          </Search>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
