import {Button, Container, Stack, Typography} from '@mui/material';
import React from 'react';
import CancelOutlined from '@mui/icons-material/CancelOutlined';

export const EmailVerificationError = () => {
  return (
    <Container>
      <Stack gap={2} alignItems="center">
        <CancelOutlined sx={{fontSize: 64, color: 'error.main'}} />
        <Typography sx={{textAlign: 'center'}} variant="h3">
          Email Verification Error
        </Typography>
        <Typography sx={{textAlign: 'center'}}>
          The was an error while verifying your email address. Please try again.
        </Typography>
        <Button href="/signup" variant="contained" color="primary">
          Sign Up
        </Button>
      </Stack>
    </Container>
  );
};
