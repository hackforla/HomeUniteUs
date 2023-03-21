import {Alert, Button, Stack, TextField, Typography} from '@mui/material';
import React from 'react';
import {useFormikContext} from 'formik';
import {ResestPasswordValues} from '../components/authentication/ResetPasswordContext';
import {useConfirmForgotPasswordMutation} from '../services/auth';
import {getErrorMessage} from '../app/helpers';
import {FormContainer} from '../components/authentication';

export const ResetPassword = () => {
  const {
    handleChange,
    values: {password, confirmPassword},
    touched,
    errors,
    setFieldTouched,
    handleSubmit,
    handleBlur,
  } = useFormikContext<ResestPasswordValues>();

  // access mutation state when hook is called from Formik provider
  const [, {error, isError, reset}] = useConfirmForgotPasswordMutation({
    fixedCacheKey: 'reset-password-post',
  });

  React.useEffect(() => {
    return () => {
      // remove error message when unmounting by resetting the state
      reset();
      setFieldTouched('password', false);
      setFieldTouched('confirmPassword', false);
    };
  }, []);

  return (
    <FormContainer>
      <Stack spacing={4} sx={{justifyContent: 'center', alignItems: 'center'}}>
        {isError ? (
          <Alert sx={{width: '100%'}} severity="error">
            {getErrorMessage(error)}
          </Alert>
        ) : null}
        <Typography variant="h4">Reset Password</Typography>
        <Stack
          component="form"
          spacing={4}
          sx={{width: '100%', alignItems: 'flex-start'}}
          onSubmit={handleSubmit}
        >
          <TextField
            fullWidth
            label="New password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password && Boolean(errors.password)}
            helperText={touched.password && errors.password}
          />
          <TextField
            fullWidth
            label="Confirm new password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.confirmPassword && Boolean(errors.confirmPassword)}
            helperText={touched.confirmPassword && errors.confirmPassword}
          />
          <Button fullWidth variant="contained" size="large" type="submit">
            Submit
          </Button>
          <Button href="/forgot-password/code" fullWidth variant="outlined">
            Back
          </Button>
        </Stack>
      </Stack>
    </FormContainer>
  );
};
