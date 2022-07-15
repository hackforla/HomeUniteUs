import {Stack, OutlinedInput} from '@mui/material';
import React from 'react';
import {ApplicationFormLabel} from '../ApplicationFormLabel';

interface FormProps {
  handleChange: (e: React.ChangeEvent<unknown>) => void;
  value: string;
  touched: boolean | undefined;
  error: string | undefined;
}

export const NameForm = ({handleChange, value, touched, error}: FormProps) => {
  return (
    <Stack sx={{flexGrow: 1, gap: 1, maxWidth: '600px'}}>
      <ApplicationFormLabel htmlFor="name">
        What is your name?
      </ApplicationFormLabel>
      <OutlinedInput
        fullWidth
        id="name"
        name="name"
        value={value}
        onChange={handleChange}
        error={touched && Boolean(error)}
      />
    </Stack>
  );
};
