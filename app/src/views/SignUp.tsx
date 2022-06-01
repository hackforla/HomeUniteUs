import React from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {styled} from '@mui/system';

import {setCredentials} from '../app/authSlice';
import {useAppDispatch} from '../app/hooks/store';
import {SignUpForm} from '../components/common/SignUpForm';
import {SignUpRequest, useSignUpMutation} from '../services/auth';
import {LocationState} from './SignIn';

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
          navigate(from, {replace: true});
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
      <SignUpForm onSubmit={handleSignUp} />
    </PageContainer>
  );
};

const PageContainer = styled('div')(({theme}) => ({
  minHeight: '100vh',
  minWidth: '100vw',
  backgroundColor: theme.palette.grey[100],
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));
