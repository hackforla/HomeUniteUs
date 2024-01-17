import {Stack, Typography} from '@mui/material';
import React from 'react';
import {FormContainer} from '../../components/authentication';
import HUU from '../../img/huu.svg';

export const Welcome = () => {
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
            create your profile. You will need to provide details about your
            background, accommodations, contact information, potential
            constraints on housing and hosts, and pet information. Upon
            completion, a Home Unite Us coordinator will be in contact to review
            your application.
          </Typography>
        </Stack>
      </Stack>
    </FormContainer>
  );
};
