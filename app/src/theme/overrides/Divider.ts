import {Theme} from '@mui/material';
import {Components} from '@mui/material/styles';

export const Divider = (theme: Theme): Components => {
  return {
    MuiDivider: {
      styleOverrides: {
        root: {
          color: theme.palette.text.secondary,
          '&:before': {
            borderTopColor: theme.palette.text.secondary,
          },
          '&:after': {
            borderTopColor: theme.palette.text.secondary,
          },
        },
      },
    },
  };
};
