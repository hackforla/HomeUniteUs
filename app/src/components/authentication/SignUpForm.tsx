import React from 'react';
import {
  Divider,
  Stack,
  Button,
  TextField,
  CircularProgress,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import {useFormik} from 'formik';
import {SignUpHostRequest, SignUpCoordinatorRequest} from '../../services/auth';
import {PasswordValidation} from '../common/PasswordValidation';
import {validationSchema} from '../../utils/PasswordValidationSchema';
import {PasswordField} from './PasswordField';

interface SignUpFormProps {
  // sign up according to host/coordinator
  onSubmit: ({
    email,
    password,
  }: SignUpHostRequest | SignUpCoordinatorRequest) => Promise<void>;
  type: string;
  getTokenIsLoading: boolean;
}

export const SignUpForm = ({
  onSubmit,
  type,
  getTokenIsLoading,
}: SignUpFormProps) => {
  const {
    handleSubmit,
    handleChange,
    values: {email, password},
    handleBlur,
    touched,
    errors,
    isValid,
    dirty,
  } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      onSubmit(values);
    },
  });

  // Add the user type field to Formik data and send it to the server in the form of a string (?). This will require updates to the types and data fetching hooks, as well as the OpenAPI spec for the signup route.

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit}
      spacing={4}
      sx={{width: '100%'}}
    >
      <TextField
        fullWidth
        autoComplete="username"
        id="email"
        name="email"
        label="Email address"
        value={email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.email && Boolean(errors.email)}
        helperText={touched.email && errors.email}
      />
      <PasswordField
        fullWidth
        label="Password"
        id="password"
        name="password"
        autoComplete="current-password"
        value={password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.password && Boolean(errors.password)}
        inputProps={{
          'aria-label': 'password',
        }}
      />
      {password ? <PasswordValidation password={password} /> : null}
      <Button
        variant="contained"
        size="large"
        type="submit"
        disabled={!isValid || !dirty}
        fullWidth
      >
        Sign up
      </Button>
      <Divider>or</Divider>
      <Button
        disabled={getTokenIsLoading}
        variant="outlined"
        size="large"
        fullWidth
        sx={{color: 'text.primary'}}
        // overrides the default react router link since we're hitting a redirect from the api
        component="a"
        href={`/api/auth/google?redirect_uri=/signup/${type}`}
      >
        <GoogleIcon sx={{fontSize: 16, marginRight: 1}} /> Continue with Google
        {getTokenIsLoading ? (
          <CircularProgress sx={{mx: 1}} size={20} color="inherit" />
        ) : null}
      </Button>
    </Stack>
  );
};
