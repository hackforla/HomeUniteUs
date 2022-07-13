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
      main: '#249BE5',
      // primary
      700: '#249BE5',
      // hover
      600: '#36A3E7',
      // pressed
      300: '#6ABBED',
      // disabled
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
});

// Add component overrides to theme
HomeUniteUsTheme.components = componentOverrides(HomeUniteUsTheme);
console.log(HomeUniteUsTheme.components);
