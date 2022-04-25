import React from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {setCredentials} from '../app/authSlice';
import {useAppDispatch} from '../app/hooks/store';
import {useSignInMutation} from '../services/auth';

export const SignIn = () => {
  const [disabled, setDisabled] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [signIn, {data: userData, isLoading}] = useSignInMutation();

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
        .then(data => console.log(data))
        .catch(err => console.log(err));
    }
  }, [location]);

  // Save location from which user was redirected to login page
  const from = location.state?.from?.pathname || '/';

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
      <h1>Sign In</h1>
      {isLoading ? <p>Loading</p> : null}
      {userData ? <p>{userData.user.email}</p> : null}
      <button disabled={disabled} onClick={handleLogin}>
        sign in
      </button>
      <a
        href={`https://homeuudemo.auth.us-east-1.amazoncognito.com/oauth2/authorize?client_id=${process.env.COGNITO_CLIENT_ID}&response_type=code&scope=email+openid+phone+profile+aws.cognito.signin.user.admin&redirect_uri=${process.env.COGNITO_REDIRECT_URI}&identity_provider=Google`}
      >
        Link to google
      </a>
    </div>
  );
};
