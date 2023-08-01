import React from 'react';
import {
  Divider,
  Stack,
  Button,
  Link,
  Typography,
  TextField,
  CircularProgress,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import {useFormik} from 'formik';
import {SignInRequest} from '../../services/auth';
import {PasswordValidation} from '../common/PasswordValidation';
import {validationSchema} from '../../utils/PasswordValidationSchema';
import {PasswordField} from './PasswordField';

interface SignUpFormProps {
  onSubmit: ({email, password}: SignInRequest) => Promise<void>;
  getTokenIsLoading: boolean;
}

export const SignUpForm = ({onSubmit, getTokenIsLoading}: SignUpFormProps) => {
  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values: {email, password},
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
      <Stack direction="row" justifyContent="flex-end" gap={0.5}>
        <Typography>Already a member?</Typography>
        <Link fontWeight="bold" href="/signin">
          Sign in
        </Link>
      </Stack>
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
        href={'/api/auth/google?redirect_uri=http://localhost:4040/signin'}
      >
        <GoogleIcon sx={{fontSize: 16, marginRight: 1}} /> Continue with Google
        {getTokenIsLoading ? (
          <CircularProgress sx={{mx: 1}} size={20} color="inherit" />
        ) : null}
      </Button>
    </Stack>
  );
};
