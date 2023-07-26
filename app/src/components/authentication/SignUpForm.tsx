import React from 'react';
import {
  Divider,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Stack,
  Button,
  Link,
  Typography,
  Alert,
  Collapse,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {styled} from '@mui/system';
import GoogleIcon from '@mui/icons-material/Google';
import {useFormik} from 'formik';
import {SignInRequest} from '../../services/auth';
import {PasswordValidation} from '../common/PasswordValidation';
import {validationSchema} from '../../utils/PasswordValidationSchema';

interface SignUpFormProps {
  onSubmit: ({email, password}: SignInRequest) => Promise<void>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  errorMessage: string;
  type: string;
}

export const SignUpForm = ({
  onSubmit,
  errorMessage,
  setErrorMessage,
  type,
}: SignUpFormProps) => {
  const {handleSubmit, handleChange, values, touched, errors, isValid, dirty} =
    useFormik({
      initialValues: {
        email: '',
        password: '',
        type: '',
      },
      validationSchema: validationSchema,
      onSubmit: values => {
        onSubmit(values);
      },
    });

  // Add the user type field to Formik data and send it to the server in the form of a string (?). This will require updates to the types and data fetching hooks, as well as the OpenAPI spec for the signup route.

  return (
    <Form onSubmit={handleSubmit}>
      <Stack spacing={1}>
        <InputLabel htmlFor="email">Email address</InputLabel>
        <OutlinedInput
          fullWidth
          id="email"
          value={values.email}
          onChange={handleChange}
          error={touched.email && Boolean(errors.email)}
        />

        {touched.email && errors.email && (
          <FormHelperText error>{errors.email}</FormHelperText>
        )}
      </Stack>
      <Stack spacing={1}>
        <InputLabel htmlFor="password">Password</InputLabel>
        <OutlinedInput
          fullWidth
          id="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          error={touched.password && Boolean(errors.password)}
        />
        {touched.password && errors.password && (
          <FormHelperText error>{errors.password}</FormHelperText>
        )}
      </Stack>
      <PasswordValidation password={values.password} />
      <Stack direction="row" gap={1}>
        <Typography>Already a member?</Typography>
        <Link fontWeight="bold" href="/signin">
          Sign in
        </Link>
      </Stack>
      <Button
        variant="contained"
        size="large"
        type="submit"
        disabled={!isValid || !dirty}
        fullWidth
      >
        Sign up
      </Button>
      <Collapse sx={{width: '100%'}} in={errorMessage !== ''}>
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setErrorMessage('');
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {errorMessage}
        </Alert>
      </Collapse>
      <Divider>or</Divider>
      <Button
        variant="outlined"
        color="secondary"
        size="large"
        fullWidth
        // overrides the default react router link since we're hitting a redirect from the api
        component="a"
        href={`/api/auth/google?redirect_uri=http://localhost:4040/signup/${type}`}
      >
        <GoogleIcon sx={{fontSize: 16, marginRight: 1}} /> Sign up with Google
      </Button>
    </Form>
  );
};

const Form = styled('form')({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: '1rem',
});
