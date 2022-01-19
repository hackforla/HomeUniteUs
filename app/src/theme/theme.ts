import {createTheme, Theme} from '@mui/material/styles';
import {orange} from '@mui/material/colors';

declare module '@mui/material/styles' {
  interface Theme {
    borderRadius: number;
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    borderRadius: number;
    status?: {
      danger?: string;
    };
  }
}

export interface ITheme extends Theme {
  borderRadius: 4;
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
  borderRadius: 4,
  status: {
    danger: orange[500],
  },
});
