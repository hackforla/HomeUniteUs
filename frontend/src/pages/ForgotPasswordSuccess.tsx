import React from 'react';
import {Typography, Button, Stack} from '@mui/material';
import {FormContainer} from '../features/authentication';

export const ForgotPasswordSuccess = () => {
  return (
    <FormContainer>
      <Stack sx={{alignItems: 'center'}}>
        <Typography sx={{textAlign: 'center', mb: 4}} variant="h4">
          Your password has been successfully changed.
        </Typography>
        <Button size="large" href="/signin" variant="contained">
          Sign in
        </Button>
      </Stack>
    </FormContainer>
  );
};
