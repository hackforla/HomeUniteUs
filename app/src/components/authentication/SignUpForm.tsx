import React from 'react';
import {
  Box,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Stack,
  Button,
} from '@mui/material';
import {styled} from '@mui/system';
import GoogleIcon from '@mui/icons-material/Google';
import {useFormik} from 'formik';
import {object, string} from 'yup';
import {SignInRequest} from '../../services/auth';

interface SignUpFormProps {
  onSubmit: ({email, password}: SignInRequest) => Promise<void>;
}

const validationSchema = object({
  email: string().email().required('email is required'),
  password: string()
    .required('password is required')
    .min(8, 'password must be at least 8 characters')
    .matches(/^(?=.*[a-z])/, 'Must contain at least one lowercase character')
    .matches(/^(?=.*[A-Z])/, 'Must contain at least one uppercase character')
    .matches(
      /^(?=.*[!@#%&])/,
      'password must contain at least one special character',
    ),
});

export const SignUpForm = ({onSubmit}: SignUpFormProps) => {
  const {handleSubmit, handleChange, values, touched, errors} = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: values => {
      onSubmit(values);
    },
  });

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
      <Button variant="contained" size="large" type="submit" fullWidth>
        Sign up
      </Button>
      <Divider>
        <div />
        <p>or</p>
        <div />
      </Divider>
      <Button
        variant="outlined"
        color="secondary"
        size="large"
        fullWidth
        href={`https://homeuudemo.auth.us-east-1.amazoncognito.com/oauth2/authorize?client_id=${
          import.meta.env.VITE_COGNITO_CLIENT_ID
        }&response_type=code&scope=email+openid+phone+profile+aws.cognito.signin.user.admin&redirect_uri=${
          import.meta.env.VITE_COGNITO_REDIRECT_URI
        }&identity_provider=Google`}
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

const Divider = styled(Box)(({theme}) => ({
  color: theme.palette.text.secondary,
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  '&> p': {
    margin: '0 8px',
  },
  '& > div': {
    flex: 1,
    backgroundColor: theme.palette.text.secondary,
    height: '1px',
  },
}));
