import {
  Box,
  FormControl,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
import {styled} from '@mui/system';
import GoogleIcon from '@mui/icons-material/Google';
import React from 'react';
import {Button} from './Button';

interface SignInFormProps {
  onSubmit: () => void;
}

export const SignInForm = ({onSubmit}: SignInFormProps) => {
  const handeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };
  return (
    <FormContainer>
      <FormHeader variant="h4">Sign In to your account</FormHeader>
      <Form component="form">
        <FormControl>
          <Label htmlFor="email">Email address</Label>
          <Input fullWidth id="email" />
        </FormControl>
        <FormControl>
          <Label htmlFor="password">Password</Label>
          <Input fullWidth id="password" />
        </FormControl>
      </Form>
      <SubmitButton label="Submit" onClick={handeSubmit} />
      <Divider>or</Divider>
      <SocialSignIn
        href={`https://homeuudemo.auth.us-east-1.amazoncognito.com/oauth2/authorize?client_id=${process.env.COGNITO_CLIENT_ID}&response_type=code&scope=email+openid+phone+profile+aws.cognito.signin.user.admin&redirect_uri=${process.env.COGNITO_REDIRECT_URI}&identity_provider=Google`}
      >
        <GoogleIcon /> Sign in with Google
      </SocialSignIn>
    </FormContainer>
  );
};

const FormContainer = styled(Stack)(({theme}) => ({
  width: '100%',
  alignItems: 'center',
  padding: '2rem',
  border: '1px solid #e0e0e0',
  borderRadius: theme.shape.borderRadius,
}));

const FormHeader = styled(Typography)({
  marginBottom: '16px',
  fontWeight: 600,
});

const Form = styled(Box)({
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

const SubmitButton = styled(Button)({
  padding: '12px',
});

const Divider = styled(Box)(({theme}) => ({
  color: theme.palette.text.secondary,
  marginBottom: '16px',
}));

const SocialSignIn = styled('a')(({theme}) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '12px',
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
