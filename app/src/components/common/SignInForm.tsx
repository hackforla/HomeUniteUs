import React from 'react';
import {
  Box,
  FormControl,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
import {styled} from '@mui/system';
import GoogleIcon from '@mui/icons-material/Google';
import {useFormik} from 'formik';
import {object, string} from 'yup';
import {PrimaryButton} from './Button';
import {SignInRequest} from '../../services/auth';

interface SignInFormProps {
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

export const SignInForm = ({onSubmit}: SignInFormProps) => {
  const formik = useFormik({
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
    <FormContainer>
      <FormHeader variant="h4">Sign In to your account</FormHeader>
      <Form onSubmit={formik.handleSubmit}>
        <FormControl>
          <Label htmlFor="email">Email address</Label>
          <Input
            fullWidth
            id="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
          />
        </FormControl>
        <FormControl>
          <Label htmlFor="password">Password</Label>
          <Input
            fullWidth
            id="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
          />
        </FormControl>
        <SubmitButton type="submit" fullWidth>
          Sign in
        </SubmitButton>
      </Form>
      <Divider>
        <div />
        <p>or</p>
        <div />
      </Divider>
      <SocialSignIn
        href={`https://homeuudemo.auth.us-east-1.amazoncognito.com/oauth2/authorize?client_id=${process.env.COGNITO_CLIENT_ID}&response_type=code&scope=email+openid+phone+profile+aws.cognito.signin.user.admin&redirect_uri=${process.env.COGNITO_REDIRECT_URI}&identity_provider=Google`}
      >
        <GoogleIcon /> Sign in with Google
      </SocialSignIn>
    </FormContainer>
  );
};

const FormContainer = styled(Stack)(({theme}) => ({
  maxWidth: '550px',
  alignItems: 'center',
  padding: '2rem',
  border: '1px solid #e0e0e0',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#fff',
  margin: '0 16px',
}));

const FormHeader = styled(Typography)({
  marginBottom: '16px',
  fontWeight: 600,
});

const Form = styled('form')({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  marginBottom: '16px',
});

const Input = styled(OutlinedInput)(({theme}) => ({
  marginBottom: '16px',
  '& > input': {
    padding: '8px 8px',
    fontSize: '16px',
    borderRadius: theme.shape.borderRadius,
  },
}));

const Label = styled('label')(({theme}) => ({
  marginBottom: '4px',
  color: theme.palette.text.secondary,
  fontSize: '16px',
  fontWeight: 500,
}));

const SubmitButton = styled(PrimaryButton)({
  padding: '8px',
});

const Divider = styled(Box)(({theme}) => ({
  color: theme.palette.text.secondary,
  marginBottom: '16px',
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

const SocialSignIn = styled('a')(({theme}) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '8px',
  width: '100%',
  fontSize: '16px',
  fontWeight: 700,
  textDecoration: 'none',
  borderRadius: theme.shape.borderRadius,
  border: '1px solid #e0e0e0',
  textAlign: 'center',
  [theme.breakpoints.down('md')]: {
    padding: '12px 16px',
  },
  transition: '.2s all ease',
  '&:hover': {
    cursor: 'pointer',
  },
  '&:disabled': {
    cursor: 'not-allowed',
  },
  '& > svg': {
    marginRight: '4px',
    fontSize: '16px',
  },
}));
