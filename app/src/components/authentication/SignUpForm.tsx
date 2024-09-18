import React from 'react';
import {
  Divider,
  Stack,
  Button,
  TextField,
  CircularProgress,
} from '@mui/material';
// import GoogleIcon from '@mui/icons-material/Google';
import {useFormik} from 'formik';
import {SignUpRequest} from '../../services/auth';
import {PasswordValidation} from '../common/PasswordValidation';
import {signUpVaildationSchema} from '../../utils/PasswordValidationSchema';
import {PasswordField} from './PasswordField';

export interface SignUpFormProps {
  isLoading: boolean;
  onSubmit: ({
    email,
    password,
    firstName,
    lastName,
  }: Omit<SignUpRequest, 'role'>) => Promise<void>;
}

export const SignUpForm = ({onSubmit, isLoading}: SignUpFormProps) => {
  const {
    handleSubmit,
    handleChange,
    values: {firstName, lastName, email, password},
    handleBlur,
    touched,
    errors,
    isValid,
    dirty,
  } = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    validationSchema: signUpVaildationSchema,
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
        id="firstName"
        name="firstName"
        label="First name"
        value={firstName}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.firstName && Boolean(errors.firstName)}
        helperText={touched.firstName && errors.firstName}
      />
      <TextField
        fullWidth
        autoComplete="username"
        id="lastName"
        name="lastName"
        label="Last name"
        value={lastName}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.lastName && Boolean(errors.lastName)}
        helperText={touched.lastName && errors.lastName}
      />
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
        disabled={!isValid || !dirty || isLoading}
        fullWidth
      >
        Sign up
        {isLoading ? (
          <CircularProgress sx={{mx: 1}} size={20} color="inherit" />
        ) : null}
      </Button>
      <Divider>or</Divider>
      {/* <Button
        disabled={isLoading}
        variant="outlined"
        size="large"
        fullWidth
        sx={{color: 'text.primary'}}
        // overrides the default react router link since we're hitting a redirect from the api
        component="a"
        href={`/api/auth/google?redirect_uri=/signup/${type}`}
      >
        <GoogleIcon sx={{fontSize: 16, marginRight: 1}} /> Continue with Google
        {isLoading ? (
          <CircularProgress sx={{mx: 1}} size={20} color="inherit" />
        ) : null}
      </Button> */}
    </Stack>
  );
};
