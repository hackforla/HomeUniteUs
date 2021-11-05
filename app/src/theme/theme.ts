import {createTheme} from '@mui/material/styles';
import {orange} from '@mui/material/colors';

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
    },
    grey: {
      300: '#E6E6E6',
      500: '#B7B6B6',
      700: '#9999',
    },
  },
  status: {
    danger: orange[500],
  },
});
