import React from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {Loading} from '../components/common';
import {useUserQuery} from '../services/auth';

export const PrivateRoute = ({children}: {children: JSX.Element}) => {
  const {data, isFetching, isLoading} = useUserQuery();
  const location = useLocation();

  if (isFetching || isLoading) return <Loading />;

  if (!data?.user) {
    return <Navigate to="/login" state={{from: location}} replace />;
  }

  return children;
};
