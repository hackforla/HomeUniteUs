import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {setCredentials} from '../app/authSlice';
import {useAppDispatch} from '../app/hooks/store';
import {useAuth} from '../app/hooks/useAuth';
import {usePrivateQuery, useSignOutMutation} from '../services/auth';

export const PrivateView = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [signOut] = useSignOutMutation();
  const {data, isLoading} = usePrivateQuery();
  const {user} = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut().unwrap();
      dispatch(setCredentials({user: null, token: null}));
      navigate('/login');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Private View</h1>
      <button onClick={handleSignOut}>sign out</button>
      <Link to={'/protected'}>Protected View</Link>
      <div>{isLoading ? <p>Loading private data</p> : null}</div>
      <div>{data ? <p>{data.message}</p> : null}</div>
      <div>{user ? <p>{user.email}</p> : null}</div>
    </div>
  );
};
