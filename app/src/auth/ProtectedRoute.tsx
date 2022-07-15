import React from 'react';
import {Navigate, useLocation, Outlet} from 'react-router-dom';
import {useAuth} from '../app/hooks/useAuth';
import {Loading} from '../components/common';
import {useUserQuery} from '../services/auth';

export const ProtectedRoute = () => {
  const {user} = useAuth();
  const {isLoading} = useUserQuery();
  const location = useLocation();
  // console.log(user, isLoading);

  // show loader while fetching data unless user already exists and is logged in
  if (isLoading && !user) return <Loading />;

  // redirect to login page if user is not authenticated
  // save location from which user was redirected to login page
  if (!user) {
    return <Navigate to="/signin" state={{from: location}} replace />;
  }

  // render children if user is authenticated
  return <Outlet />;
};
