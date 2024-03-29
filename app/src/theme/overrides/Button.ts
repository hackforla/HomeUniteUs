import {Theme} from '@mui/material';
import {Components} from '@mui/material/styles';
import {LinkBehavior} from './Link';

export const Button = (theme: Theme): Components => {
  return {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
        LinkComponent: LinkBehavior,
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          fontWeight: '700',
          textTransform: 'none',
        },
        containedPrimary: {
          '&:active': {
            backgroundColor: theme.palette.primary.main,
          },
        },
        outlinedSecondary: {
          color: 'black',
          borderColor: 'black',
          '&:hover': {
            backgroundColor: 'black',
            color: '#fff',
          },
        },
      },
    },
  };
};
