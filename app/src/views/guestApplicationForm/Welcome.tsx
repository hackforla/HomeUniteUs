import {Button, Stack, Typography} from '@mui/material';

import React from 'react';
import {useNavigate} from 'react-router-dom';
import {FormContainer} from '../../components/authentication';

import HUU from '../../img/huu.svg';

export const Welcome = () => {
  // const [errorMessage, setErrorMessage] = React.useState('');
  const navigate = useNavigate();

  //navigate to next form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // navigate to next form
    navigate('../expectations');
  };

  return (
    <FormContainer>
      <Stack
        spacing={4}
        sx={{justifyContent: 'center', alignItems: 'center', width: '100%'}}
      >
        <Typography variant="h4">Welcome</Typography>
        <Stack
          component="form"
          title="Welcome Page"
          sx={{width: '100%', alignItems: 'flex-start'}}
          onSubmit={handleSubmit}
          spacing={4}
        >
          <img
            src={HUU}
            alt="HUU Logo"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '50%',
              margin: 'auto',
            }}
          />

          <Typography variant="body1">
            Thank you for your interest in being a guest! The next steps will
            create your profile. You&aposll need to provide details about your
            background, acommodations, contact information, potential
            constraints on housing and hosts, and pet information. Upon
            completion, a Home Unite Us cooridinator will be in contact to
            review your application.
          </Typography>
          {/* navigate to next page */}
          <Button fullWidth variant="contained" size="large" type="submit">
            Next
          </Button>
          {/* navigate to previous page */}
          <Button href="/guest" fullWidth variant="outlined">
            Back
          </Button>
        </Stack>
      </Stack>
    </FormContainer>
  );
};
