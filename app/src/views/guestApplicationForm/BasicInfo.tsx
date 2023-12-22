import {Button, Stack, TextField, Typography, MenuItem} from '@mui/material';

import React from 'react';
import {useNavigate} from 'react-router-dom';
import {FormContainer} from '../../components/authentication';

export const BasicInfo = () => {
  // const [errorMessage, setErrorMessage] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate('/');
  };

  const genders = [
    'Woman',
    'Man',
    'Transgender',
    'Non-Binary / Non-Conforming',
  ];

  return (
    <FormContainer>
      <Stack
        spacing={4}
        sx={{justifyContent: 'center', alignItems: 'left', width: '100%'}}
      >
        <Typography variant="h5" sx={{fontWeight: 'bold'}}>
          Basic Information
        </Typography>
        <Stack
          component="form"
          title="Basic Info Page"
          sx={{width: '100%', alignItems: 'flex-start'}}
          onSubmit={handleSubmit}
          spacing={4}
        >
          <TextField
            fullWidth
            label="Full Name"
            id="fullWidth"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            fullWidth
            label="Date of Birth"
            id="fullWidth"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            fullWidth
            label="Full Name"
            id="fullWidth"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            fullWidth
            label="Gender Identity"
            id="outlined-select-currency"
            defaultValue="Select"
            select
            InputLabelProps={{
              shrink: true,
            }}
          >
            {genders.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <Button fullWidth variant="contained" size="large" type="submit">
            Continue
          </Button>

          <Button href="../expectations" fullWidth variant="outlined">
            Back
          </Button>
        </Stack>
        <Typography
          variant="subtitle1"
          sx={{textAlign: 'center', fontWeight: 'bold'}}
        >
          Save and Exit Application
        </Typography>
      </Stack>
    </FormContainer>
  );
};
