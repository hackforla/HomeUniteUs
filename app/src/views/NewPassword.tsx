import React from 'react';
import {
  Typography,
  Stack,
  Alert,
  Button,
  CircularProgress,
} from '@mui/material';
import {useFormikContext} from 'formik';
import {NewPasswordValues} from '../components/authentication/NewPasswordContext';
import {useNewPasswordMutation} from '../services/auth';
import {getErrorMessage} from '../app/helpers';
import {FormContainer, PasswordField} from '../components/authentication';

export const NewPassword = () => {
  const {
    handleChange,
    values: {password, confirmPassword},
    touched,
    errors,
    setFieldTouched,
    handleSubmit,
    handleBlur,
  } = useFormikContext<NewPasswordValues>();

  const [, {error, isError, isLoading, reset}] = useNewPasswordMutation();

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
        <Typography variant="h4">Enter a New Password:</Typography>
        <Stack
          component="form"
          spacing={4}
          sx={{width: '100%', alignItems: 'flex-start'}}
          onSubmit={handleSubmit}
        >
          <PasswordField
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
          <PasswordField
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
          <Button
            disabled={isLoading}
            fullWidth
            variant="contained"
            size="large"
            type="submit"
          >
            Submit
            {isLoading ? (
              <CircularProgress sx={{mx: 1}} size={20} color="inherit" />
            ) : null}
          </Button>
        </Stack>
      </Stack>
    </FormContainer>
  );
};
