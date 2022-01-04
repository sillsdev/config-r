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
