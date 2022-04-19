import React from 'react';
import {setCredentials} from '../app/authSlice';
import {useAppDispatch} from '../app/hooks/store';
import {useSignInMutation, useUserQuery} from '../services/auth';

export const Login = () => {
  const dispatch = useAppDispatch();
  const [login, {data: userData, isLoading}] = useSignInMutation();
  const {data, refetch} = useUserQuery();

  const handleLogin = async () => {
    try {
      const response = await login({
        email: 'erikguntner@gmail.com',
        password: '#Abc1234',
      }).unwrap();

      const {user, token} = response;

      dispatch(setCredentials({user, token}));
    } catch (err) {
      console.log(err);
    }
  };

  const handlePrivateRequest = async () => {
    refetch();
  };

  return (
    <div>
      <h1>Login</h1>
      {isLoading ? <p>Loading</p> : null}
      {userData ? <p>{userData.user.email}</p> : null}
      <button onClick={handleLogin}>login</button>
      <button onClick={handlePrivateRequest}>Private Route</button>
      <p>{data ? data.user.email : 'no private data'}</p>
    </div>
  );
};
