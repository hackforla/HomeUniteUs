import {createTheme} from '@mui/material/styles';
import {componentOverrides} from './overrides';

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

export const HomeUniteUsTheme = createTheme({
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
  },
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
