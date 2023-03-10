import {
  Alert,
  Button,
  Collapse,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import {useFormikContext} from 'formik';
import {ResestPasswordValues} from '../components/authentication/ResetPasswordContext';
import {useResetPasswordMutation} from '../services/auth';
import {getErrorMessage} from '../app/helpers';

export const ResetPassword = () => {
  const {
    handleChange,
    values: {password, confirmPassword},
    touched,
    errors,
    handleSubmit,
  } = useFormikContext<ResestPasswordValues>();

  // access mutation state when hook is called from Formik provider
  const [, {error, isError, reset}] = useResetPasswordMutation({
    fixedCacheKey: 'reset-password-post',
  });

  React.useEffect(() => {
    return () => {
      // remove error message when unmounting by resetting the state
      reset();
    };
  }, []);

  return (
    <Stack
      spacing={2}
      sx={{justifyContent: 'center', alignItems: 'flex-start', p: 4}}
    >
      <Collapse sx={{width: '100%'}} in={isError}>
        <Alert severity="error">{getErrorMessage(error)}</Alert>
      </Collapse>
      <Typography variant="h4">Reset Password</Typography>
      <Stack
        component="form"
        spacing={2}
        sx={{minWidth: '350px', alignItems: 'flex-start'}}
        onSubmit={handleSubmit}
      >
        <TextField
          fullWidth
          label="Password"
          id="password"
          name="password"
          value={password}
          onChange={handleChange}
          error={touched.password && Boolean(errors.password)}
        />
        <TextField
          fullWidth
          label="Confirm password"
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleChange}
          error={touched.confirmPassword && Boolean(errors.confirmPassword)}
        />
        <Button variant="contained" size="large" type="submit">
          Submit
        </Button>
      </Stack>
    </Stack>
  );
};
