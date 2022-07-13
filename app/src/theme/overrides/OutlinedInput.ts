import {Theme} from '@mui/material';
import {alpha, Components} from '@mui/material/styles';

export const OutlinedInput = (theme: Theme): Components => {
  return {
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          padding: '12px 12px',
        },
        notchedOutline: {
          borderColor: theme.palette.grey[500],
        },
        root: {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.light,
          },
          '&.Mui-focused': {
            boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
            '& .MuiOutlinedInput-notchedOutline': {
              border: `1px solid ${theme.palette.primary.light}`,
            },
          },
          '&.Mui-error': {
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.error.light,
            },
            '&.Mui-focused': {
              boxShadow: `0 0 0 2px ${alpha(theme.palette.error.main, 0.2)}`,
              '& .MuiOutlinedInput-notchedOutline': {
                border: `1px solid ${theme.palette.error.light}`,
              },
            },
          },
        },
      },
    },
  };
};
