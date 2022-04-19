import React from 'react';
import {RouteProps, Navigate, useLocation} from 'react-router-dom';
import {useAuth} from '../app/hooks/useAuth';

export const PrivateRoute = ({children}: RouteProps) => {
  const user = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{from: location}} replace />;
  }
  return children;
};
