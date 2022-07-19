import {RadioGroup, FormControlLabel, Radio, Stack} from '@mui/material';
import {useFormikContext} from 'formik';
import React from 'react';
import {FormValues} from '../../../views/GuestApplicationTracker';
import {ApplicationFormLabel} from '../ApplicationFormLabel';

export const PetsForm = () => {
  const {
    values: {pets},
    handleChange,
  } = useFormikContext<FormValues>();

  return (
    <Stack>
      <ApplicationFormLabel id="pets">Do you have pets?</ApplicationFormLabel>
      <RadioGroup
        aria-labelledby="pets"
        name="pets"
        value={pets}
        onChange={handleChange}
      >
        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="no" control={<Radio />} label="No" />
      </RadioGroup>
    </Stack>
  );
};
