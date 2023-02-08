import React from 'react';
import {useNavigate, useLocation, Location} from 'react-router-dom';
import {Typography, Stack, styled, Theme, Link, Box} from '@mui/material';

import {setCredentials} from '../app/authSlice';
import {useAppDispatch} from '../app/hooks/store';
import {SignInForm} from '../components/authentication/SignInForm';
import {SignInRequest, useSignInMutation} from '../services/auth';
import logo from '../img/favicon.png';
export interface LocationState {
  from: Location;
}

export const SignIn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [signIn] = useSignInMutation();
  const locationState = location.state as LocationState;

  // Save location from which user was redirected to login page
  const from = locationState?.from?.pathname || '/';

  React.useEffect(() => {
    if (location.search.includes('code')) {
      const code = location.search.split('?code=')[1];
      fetch('/api/auth/token', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({code}),
      })
        .then(res => res.json())
        .then(() => {
          // navigate user to the page they tried to access before being redirected to login page
          // navigate(from, {replace: true});
          navigate('/');
        })
        .catch(err => console.log('error', err));
    }
  }, [location, from]);

  const handleSignIn = async ({email, password}: SignInRequest) => {
    try {
      const response = await signIn({
        email,
        password,
      }).unwrap();

      const {user, token} = response;

      dispatch(setCredentials({user, token}));
      // navigate user to the page they tried to access before being redirected to login page
      // navigate(from, {replace: true});
      // navigate user to home page
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <PageContainer>
      <FormContainer gap={2}>
        <Logo src={logo} alt="Home Unite Us logo" />
        <FormHeader variant="h4">Sign in to your account</FormHeader>
        <SignInForm onSubmit={handleSignIn} />
        <Stack direction="row" alignItems="center" gap={0.5}>
          <Typography variant="body2">Don&apos;t have an account?</Typography>
          <Link fontWeight="bold" href="/signup">
            Sign up
          </Link>
        </Stack>
      </FormContainer>
    </PageContainer>
  );
};

const Logo = styled('img')({
  width: '100px',
  height: '100px',
});

const FormContainer = styled(Stack)(({theme}: {theme: Theme}) => ({
  maxWidth: '550px',
  alignItems: 'center',
  padding: '2rem',
  border: '1px solid #e0e0e0',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#fff',
  margin: '0 16px',
}));

const FormHeader = styled(Typography)({
  textAlign: 'center',
  fontWeight: 600,
});

const PageContainer = styled(Box)(({theme}) => ({
  minHeight: '100vh',
  minWidth: '100vw',
  backgroundColor: theme.palette.grey[100],
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));
