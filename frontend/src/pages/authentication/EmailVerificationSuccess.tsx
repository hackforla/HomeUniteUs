import {Button, Stack, Typography} from '@mui/material';
import React from 'react';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import {FormContainer} from '../features/authentication';

export const EmailVerificationSuccess = () => {
  return (
    <FormContainer>
      <Stack gap={2} alignItems="center">
        <CheckCircleOutline sx={{fontSize: 64, color: 'success.main'}} />
        <Typography variant="h4" fontWeight="600" textAlign="center">
          Email Verification Success
        </Typography>
        <Typography sx={{textAlign: 'center'}}>
          Sign in to your account to get started
        </Typography>
        <Button href="/signin" variant="contained" color="primary">
          Sign in
        </Button>
      </Stack>
    </FormContainer>
  );
};
