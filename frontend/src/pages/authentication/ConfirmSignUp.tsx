import React from 'react';
import {
  Typography,
  Stack,
  Button,
  CircularProgress,
  IconButton,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {useSearchParams} from 'react-router-dom';
import {useResendConfirmationCodeMutation} from '../../services/auth';
import {FormContainer} from '../../features/authentication';
import {isFetchBaseQueryError, isErrorWithMessage} from '../../redux/helpers';

interface Alert {
  severity: 'success' | 'error';
  message: string;
}

export const ConfirmSignUp = () => {
  const [alert, setAlert] = React.useState<Alert | undefined>(undefined);
  const [resendCode, {isLoading}] = useResendConfirmationCodeMutation();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  const handleResendCode = async () => {
    if (!email) return;

    try {
      await resendCode({email}).unwrap();
      setAlert({
        severity: 'success',
        message: 'A new verification link has been sent to your email.',
      });
    } catch (err) {
      let errorMessage = '';
      if (isFetchBaseQueryError(err)) {
        errorMessage =
          err.data?.message || `An error occurred  in Confirm Sign up`;
      } else if (isErrorWithMessage(err)) {
        errorMessage = err.message;
      }
      setAlert({
        severity: 'error',
        message: errorMessage,
      });
    }
  };

  return (
    <FormContainer>
      <Stack
        py={2}
        spacing={4}
        sx={{justifyContent: 'center', alignItems: 'center', width: '100%'}}
      >
        {alert ? (
          <Alert
            sx={{width: '100%'}}
            severity={alert.severity}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setAlert(undefined);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {alert.message}
          </Alert>
        ) : null}
        <Typography variant="h4" fontWeight="600" textAlign="center">
          Confirm your email address
        </Typography>
        <Typography variant="body1" textAlign="center">
          We sent a verification link to <strong>{email}</strong>. Please follow
          the instructions in the email to complete registration.
        </Typography>
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleResendCode}
          disabled={isLoading || !email}
        >
          Resend email
          {isLoading ? (
            <CircularProgress sx={{mx: 1}} size={20} color="inherit" />
          ) : null}
        </Button>
        <Button href="/signup" fullWidth variant="outlined">
          Back
        </Button>
      </Stack>
    </FormContainer>
  );
};
