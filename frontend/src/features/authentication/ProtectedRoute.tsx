import React from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useAuth} from '../../redux/hooks/useAuth';
import {Loading} from '../ui';
import {useSessionMutation} from '../../services/auth';

export const ProtectedRoute = ({children}: {children: JSX.Element}) => {
  const {user} = useAuth();

  const [, {isLoading, isUninitialized}] = useSessionMutation({
    fixedCacheKey: 'session-post',
  });
  const location = useLocation();

  // show loader while fetching data unless user already exists and is logged in
  if (isUninitialized || (isLoading && !user)) return <Loading />;

  // redirect to login page if user is not authenticated
  // save location from which user was redirected to login page
  if (!user) {
    return <Navigate to="/signin" state={{from: location}} replace />;
  }

  // render children if user is authenticated
  return children;
};
