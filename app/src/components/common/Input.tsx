import React from 'react';
import {
  OutlinedInput,
  Typography,
  styled,
  Theme,
  OutlinedInputProps,
} from '@mui/material';

interface InputProps extends Omit<OutlinedInputProps, 'label'> {
  label: string;
  errors?: string | undefined;
  touched?: boolean | undefined;
}

export const Input = ({
  label,
  id,
  value,
  onChange,
  errors,
  touched,
  ...props
}: InputProps) => {
  return (
    <>
      <Label htmlFor={id}>{label}</Label>
      <TextInput
        fullWidth
        id={id}
        value={value}
        onChange={onChange}
        error={touched && Boolean(errors)}
        {...props}
      />
      <HelperText>
        <Typography variant="body2">{touched && errors}</Typography>
      </HelperText>
    </>
  );
};

const TextInput = styled(OutlinedInput)(({theme}: {theme: Theme}) => ({
  '& > input': {
    padding: '8px 8px',
    fontSize: '16px',
    borderRadius: theme.shape.borderRadius,
  },
}));

const Label = styled('label')(({theme}: {theme: Theme}) => ({
  marginBottom: '4px',
  color: theme.palette.text.secondary,
  fontSize: '16px',
  fontWeight: 500,
}));

const HelperText = styled('div')({
  height: '16px',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  color: '#f44336',
});
