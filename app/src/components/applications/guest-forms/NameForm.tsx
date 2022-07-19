import {Stack, OutlinedInput} from '@mui/material';
import {useFormikContext} from 'formik';
import React from 'react';
import {FormValues} from '../../../views/GuestApplicationTracker';
import {ApplicationFormLabel} from '../ApplicationFormLabel';

export const NameForm = () => {
  const {
    values: {firstName},
    handleChange,
    touched,
    errors,
  } = useFormikContext<FormValues>();

  return (
    <Stack sx={{flexGrow: 1, gap: 1, maxWidth: '600px'}}>
      <ApplicationFormLabel htmlFor="name">
        What is your name?
      </ApplicationFormLabel>
      <OutlinedInput
        fullWidth
        id="firstName"
        name="firstName"
        value={firstName}
        onChange={handleChange}
        error={touched.firstName && Boolean(errors.firstName)}
      />
    </Stack>
  );
};
