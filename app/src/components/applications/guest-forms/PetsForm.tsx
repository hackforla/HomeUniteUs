import {RadioGroup, FormControlLabel, Radio, Stack} from '@mui/material';
import React from 'react';
import {ApplicationFormLabel} from '../ApplicationFormLabel';

interface PetsFormProps {
  handleChange: (e: React.ChangeEvent<unknown>) => void;
  value: string;
}

export const PetsForm = ({value, handleChange}: PetsFormProps) => {
  return (
    <Stack>
      <ApplicationFormLabel id="pets">Do you have pets?</ApplicationFormLabel>
      <RadioGroup
        aria-labelledby="pets"
        name="pets"
        value={value}
        onChange={handleChange}
      >
        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="no" control={<Radio />} label="No" />
      </RadioGroup>
    </Stack>
  );
};
