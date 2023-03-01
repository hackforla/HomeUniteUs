import {Button, Container, Stack, Typography} from '@mui/material';
import React from 'react';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';

export const EmailVerificationSuccess = () => {
  return (
    <Container>
      <Stack gap={2} alignItems="center">
        <CheckCircleOutline sx={{fontSize: 64, color: 'success.main'}} />
        <Typography sx={{textAlign: 'center'}} variant="h3">
          Email Verification Success
        </Typography>
        <Typography sx={{textAlign: 'center'}}>
          Sign in to your account to get started
        </Typography>
        <Button href="/signin" variant="contained" color="primary">
          Sign in
        </Button>
      </Stack>
    </Container>
  );
};
