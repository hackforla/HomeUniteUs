import React from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {setCredentials} from '../app/authSlice';
import {useAppDispatch} from '../app/hooks/store';
import {useSignInMutation} from '../services/auth';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [login, {data: userData, isLoading}] = useSignInMutation();

  // Save location from which user was redirected to login page
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async () => {
    try {
      const response = await login({
        email: 'erikguntner@gmail.com',
        password: '#Abc1234',
      }).unwrap();

      const {user, token} = response;

      dispatch(setCredentials({user, token}));
      navigate(from, {replace: true});
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {isLoading ? <p>Loading</p> : null}
      {userData ? <p>{userData.user.email}</p> : null}
      <button onClick={handleLogin}>login</button>
    </div>
  );
};
