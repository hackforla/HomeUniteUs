import React from 'react';
import {useNavigate, useLocation, Location} from 'react-router-dom';
import {Typography, Stack, styled, Theme} from '@mui/material';

import {setCredentials} from '../app/authSlice';
import {useAppDispatch} from '../app/hooks/store';
import {SignInForm} from '../components/authentication/SignInForm';
import {SignInRequest, useSignInMutation} from '../services/auth';

export interface LocationState {
  from: Location;
}

export const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
        .then(data => {
          console.log('data', data);
          navigate(from, {replace: true});
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
      navigate(from, {replace: true});
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <PageContainer>
      <FormContainer>
        <FormHeader variant="h4">Sign in to your account</FormHeader>
        <SignInForm onSubmit={handleSignIn} />
      </FormContainer>
    </PageContainer>
  );
};

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
  marginBottom: '16px',
  fontWeight: 600,
});

const PageContainer = styled('div')(({theme}) => ({
  minHeight: '100vh',
  minWidth: '100vw',
  backgroundColor: theme.palette.grey[100],
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));
