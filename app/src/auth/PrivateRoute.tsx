import React from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {Loading} from '../components/common';
import {useUserQuery} from '../services/auth';

export const PrivateRoute = ({children}: {children: JSX.Element}) => {
  const {data, isLoading} = useUserQuery();
  const location = useLocation();

  // show loader while fetching data
  if (isLoading) return <Loading />;

  // redirect to login page if user is not authenticated
  // save location from which user was redirected to login page
  if (!data?.user) {
    return <Navigate to="/login" state={{from: location}} replace />;
  }

  // render children if user is authenticated
  return children;
};
