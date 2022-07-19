import React from 'react';
import {Stack, OutlinedInput, FormHelperText, InputLabel} from '@mui/material';
import {useFormikContext} from 'formik';
import {FormValues} from '../../../views/GuestApplicationTracker';
import {ApplicationFormLabel} from '../ApplicationFormLabel';

export const PersonalInfoForm = () => {
  const {
    values: {firstName, middleName, lastName, dateOfBirth},
    handleChange,
    touched,
    errors,
  } = useFormikContext<FormValues>();

  return (
    <Stack sx={{flexGrow: 1, gap: 2, maxWidth: '600px'}}>
      <ApplicationFormLabel>
        What is your name and date of birth?
      </ApplicationFormLabel>
      <Stack spacing={1}>
        <InputLabel htmlFor="firstName">First Name</InputLabel>
        <OutlinedInput
          autoFocus
          fullWidth
          id="firstName"
          name="firstName"
          type="firstName"
          value={firstName}
          onChange={handleChange}
          error={touched.firstName && Boolean(errors.firstName)}
        />
        {touched.firstName && errors.firstName && (
          <FormHelperText error>{errors.firstName}</FormHelperText>
        )}
      </Stack>
      <Stack spacing={1}>
        <InputLabel htmlFor="middleName">Middle Name</InputLabel>
        <OutlinedInput
          fullWidth
          id="middleName"
          name="middleName"
          type="middleName"
          value={middleName}
          onChange={handleChange}
          error={touched.middleName && Boolean(errors.middleName)}
        />
        {touched.middleName && errors.middleName && (
          <FormHelperText error>{errors.middleName}</FormHelperText>
        )}
      </Stack>
      <Stack spacing={1}>
        <InputLabel htmlFor="lastName">Last Name</InputLabel>
        <OutlinedInput
          fullWidth
          id="lastName"
          name="lastName"
          type="lastName"
          value={lastName}
          onChange={handleChange}
          error={touched.lastName && Boolean(errors.lastName)}
        />
        {touched.lastName && errors.lastName && (
          <FormHelperText error>{errors.lastName}</FormHelperText>
        )}
      </Stack>
      <Stack spacing={1}>
        <InputLabel htmlFor="dateOfBirth">Date of Birth MM/DD/YYYY</InputLabel>
        <OutlinedInput
          fullWidth
          id="dateOfBirth"
          name="dateOfBirth"
          type="dateOfBirth"
          value={dateOfBirth}
          onChange={handleChange}
          error={touched.dateOfBirth && Boolean(errors.dateOfBirth)}
        />
        {touched.dateOfBirth && errors.dateOfBirth && (
          <FormHelperText error>{errors.dateOfBirth}</FormHelperText>
        )}
      </Stack>
    </Stack>
  );
};
