import React from 'react';
import {alpha} from '@mui/material/styles';
import {
  OutlinedInput,
  InputLabel,
  Typography,
  styled,
  Theme,
  OutlinedInputProps,
  Stack,
} from '@mui/material';

interface InputProps extends Omit<OutlinedInputProps, 'label'> {
  label: string;
  errorMessage?: string | undefined;
  touched?: boolean | undefined;
}

export const Input = ({
  label,
  id,
  value,
  onChange,
  errorMessage,
  touched,
  ...props
}: InputProps) => {
  return (
    <Stack spacing={1}>
      <Label htmlFor={id}>{label}</Label>
      <TextInput
        fullWidth
        id={id}
        value={value}
        onChange={onChange}
        error={touched && Boolean(errorMessage)}
        {...props}
      />
      <HelperText>
        <Typography variant="body2">{touched && errorMessage}</Typography>
      </HelperText>
    </Stack>
  );
};

const TextInput = styled(OutlinedInput)(({theme}: {theme: Theme}) => ({
  '& > input': {
    padding: '12px 12px',
    fontSize: '16px',
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.grey[500]}`,
  },
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
}));

const Label = styled(InputLabel)(({theme}: {theme: Theme}) => ({
  color: theme.palette.text.secondary,
  fontWeight: 500,
  '&.MuiInputLabel-shrink': {
    background: theme.palette.background.paper,
    padding: '0 8px',
    marginLeft: 0,
    lineHeight: '1.4375em',
  },
}));

const HelperText = styled('div')({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  color: '#f44336',
});
