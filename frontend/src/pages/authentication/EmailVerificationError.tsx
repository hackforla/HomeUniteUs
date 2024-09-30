import {Button, Stack, Typography} from '@mui/material';
import React from 'react';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import {FormContainer} from '../../features/authentication';

export const EmailVerificationError = () => {
  return (
    <FormContainer>
      <Stack gap={2} alignItems="center" justifyContent="center">
        <CancelOutlined sx={{fontSize: 64, color: 'error.main'}} />
        <Typography variant="h4" fontWeight="600" textAlign="center">
          Email Verification Error
        </Typography>
        <Typography sx={{textAlign: 'center'}}>
          The was an error while verifying your email address. Please try again.
        </Typography>
        <Button href="/signup" variant="contained" color="primary">
          Sign Up
        </Button>
      </Stack>
    </FormContainer>
  );
};
