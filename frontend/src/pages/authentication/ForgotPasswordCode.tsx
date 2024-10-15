import {
  Button,
  Stack,
  FormHelperText,
  Typography,
  Box,
  Alert,
  IconButton,
  AlertColor,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {useFormikContext} from 'formik';
import React from 'react';
import {useNavigate} from 'react-router-dom';
import {ResestPasswordValues} from '../../features/authentication/ResetPasswordContext';
import {CodeField, FormContainer} from '../../features/authentication';
import {useForgotPasswordMutation} from '../../services/auth';
import {getErrorMessage} from '../../redux/helpers';

interface Alert {
  severity: AlertColor;
  message: string;
}

export const ForgotPasswordCode = () => {
  const [alert, setAlert] = React.useState<Alert | undefined>(undefined);

  const navigate = useNavigate();
  const {
    values: {code, email},
    errors,
    touched,
    setFieldValue,
  } = useFormikContext<ResestPasswordValues>();

  const [forgotPassword, {isLoading}] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (errors.code) return;
    navigate('/forgot-password/reset');
  };

  const resendCode = async () => {
    try {
      await forgotPassword({email}).unwrap();
      setAlert({
        severity: 'success',
        message: 'A new code has been sent to your email.',
      });
    } catch (err) {
      setAlert({
        severity: 'error',
        message: getErrorMessage(err),
      });
    }
  };

  const setCode = (code: string) => {
    setFieldValue('code', code);
  };

  if (!email) {
    return (
      <FormContainer>
        <Alert sx={{width: '100%'}} severity="error">
          Whoops! This action relies on data collected in previous steps that is
          currently missing. Please restart the process if you would still like
          to reset your password.
        </Alert>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <Stack spacing={4} sx={{justifyContent: 'center', alignItems: 'center'}}>
        {alert?.message ? (
          <Alert
            sx={{width: '100%'}}
            data-testid={alert.severity === 'success' ? 'success' : 'error'}
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
        <Box>
          <Typography mb={1} variant="h4">
            Verification Code
          </Typography>
          <Typography variant="body1">
            enter the code sent to your email
          </Typography>
        </Box>
        <Stack
          component="form"
          title="Forgot Password Code"
          spacing={4}
          sx={{alignItems: 'center'}}
          onSubmit={handleSubmit}
          data-testid="/success/i"
        >
          <Stack spacing={1} sx={{width: '100%'}}>
            <CodeField
              id="code"
              onChange={setCode}
              error={touched.code && Boolean(errors.code)}
            />
            {touched.code && errors.code ? (
              <FormHelperText error>{errors.code}</FormHelperText>
            ) : null}
          </Stack>
          <Button
            disabled={isLoading}
            onClick={resendCode}
            fullWidth
            size="large"
          >
            Resend Code
            {isLoading ? (
              <CircularProgress sx={{mx: 1}} size={20} color="inherit" />
            ) : null}
          </Button>
          <Button
            disabled={code.length < 6 || Boolean(errors.code)}
            fullWidth
            variant="contained"
            size="large"
            type="submit"
          >
            Verify
          </Button>
          <Button href="/forgot-password" fullWidth variant="outlined">
            Back
          </Button>
        </Stack>
      </Stack>
    </FormContainer>
  );
};
