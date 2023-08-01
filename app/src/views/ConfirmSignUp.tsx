import React from 'react';
import {FormContainer} from '../components/authentication';
import {Typography, Stack, Button} from '@mui/material';

export const ConfirmSignUp = () => {
  return (
    <FormContainer>
      <Stack
        py={2}
        spacing={4}
        sx={{justifyContent: 'center', alignItems: 'center', width: '100%'}}
      >
        <Typography variant="h4" fontWeight="600" textAlign="center">
          Confirm your email address
        </Typography>
        <Typography variant="body1" textAlign="center">
          We sent a verification link to <strong>sample@email.com</strong>.
          Please follow the instructions in the email to complete registration.
        </Typography>
        <Button fullWidth variant="contained" size="large" type="submit">
          Resend email
        </Button>
        <Button href="/forgot-password" fullWidth variant="outlined">
          Back
        </Button>
      </Stack>
    </FormContainer>
  );
};
