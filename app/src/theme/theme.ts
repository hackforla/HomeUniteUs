import type {} from '@mui/x-data-grid/themeAugmentation';
import {createTheme} from '@mui/material/styles';
import {componentOverrides} from './overrides';
import {Shadows} from '@mui/material/styles/shadows';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

export let HomeUniteUsTheme = createTheme();

HomeUniteUsTheme = createTheme({
  palette: {
    primary: {
      dark: '#196ca0',
      main: '#0057A1',
      600: '#36A3E7',
      light: '#4fafea',
      300: '#6ABBED',
      100: '#ACD9F5',
    },
    grey: {
      700: '#9999',
      500: '#B7B6B6',
      300: '#E6E6E6',
    },
    text: {
      secondary: '#777777',
    },
  },
  shadows: [
    // composing shadows from the default theme. 25 shadows are required
    ...HomeUniteUsTheme.shadows.slice(0, 19),
    // add custom shadows here
    '0px 4px 10px rgba(0, 0, 0, 0.25)',
    // spread the rest of the default shadows, make sure to decrement from this array if adding more shadows.
    // I chose the 20th shadow since I believe these are less commonly used and didn't want to override shadows that are used in other components
    ...HomeUniteUsTheme.shadows.slice(20),
  ] as Shadows,
  shape: {
    borderRadius: 4,
  },
  mixins: {
    toolbar: {
      minHeight: 52,
    },
  },
});

// Add component overrides to theme
HomeUniteUsTheme.components = componentOverrides(HomeUniteUsTheme);
