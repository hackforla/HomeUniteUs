import React from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {Container} from '@mui/material';

import {setCredentials} from '../app/authSlice';
import {useAppDispatch} from '../app/hooks/store';
import {SignInForm} from '../components/common/SignInForm';
import {useSignInMutation} from '../services/auth';

export const SignIn = () => {
  const [disabled, setDisabled] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [signIn] = useSignInMutation();

  // Save location from which user was redirected to login page
  const from = location.state?.from?.pathname || '/';

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
          console.log(data);
          navigate(from, {replace: true});
        })
        .catch(err => console.log(err));
    }
  }, [location, from]);

  const handleLogin = async () => {
    if (disabled) {
      return;
    }

    setDisabled(true);

    try {
      const response = await signIn({
        email: 'erikguntner@gmail.com',
        password: '#Abc1234',
      }).unwrap();

      const {user, token} = response;

      dispatch(setCredentials({user, token}));
      navigate(from, {replace: true});
    } catch (err) {
      console.log(err);
    }

    setDisabled(false);
  };

  return (
    <div>
      <Container maxWidth="sm">
        <SignInForm onSubmit={handleLogin} />
      </Container>
    </div>
  );
};
