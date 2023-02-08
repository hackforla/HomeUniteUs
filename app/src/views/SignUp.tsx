import React from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {Stack, Typography, styled} from '@mui/material';

import {setCredentials} from '../app/authSlice';
import {useAppDispatch} from '../app/hooks/store';
import {SignUpForm} from '../components/authentication/SignUpForm';
import {SignUpRequest, useSignUpMutation} from '../services/auth';
import {LocationState} from './SignIn';
import logo from '../img/favicon.png';

export const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [signUp] = useSignUpMutation();
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
          // navigate(from, {replace: true});
          navigate('/');
        })
        .catch(err => console.log(err));
    }
  }, [location, from]);

  const handleSignUp = async ({email, password}: SignUpRequest) => {
    try {
      const response = await signUp({
        email,
        password,
      }).unwrap();

      const {user, token} = response;

      dispatch(setCredentials({user, token}));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <PageContainer>
      <FormContainer gap={2}>
        <Logo src={logo} alt="Home Unite Us logo" />
        <FormHeader variant="h4">Sign up for an account</FormHeader>
        <SignUpForm onSubmit={handleSignUp} />
      </FormContainer>
    </PageContainer>
  );
};

const Logo = styled('img')({
  width: '100px',
  height: '100px',
});

const PageContainer = styled('div')(({theme}) => ({
  minHeight: '100vh',
  minWidth: '100vw',
  backgroundColor: theme.palette.grey[100],
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

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
  textAlign: 'center',
  fontWeight: 600,
});
