import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {clearAuthState} from '../app/authSlice';
import {useAppDispatch} from '../app/hooks/store';
import {useSignOutMutation} from '../services/auth';

export const PrivateView = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [signOut] = useSignOutMutation();

  const handleSignOut = async () => {
    try {
      await signOut().unwrap();
      dispatch(clearAuthState());
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
    </div>
  );
};
