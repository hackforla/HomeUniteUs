import * as React from 'react';
import {withAuthenticationRequired} from '@auth0/auth0-react';
import {Loading} from '../components/common';

interface ProtectedRouteProps {
  component: React.ComponentType<unknown>;
  [x: string]: unknown;
}

export const ProtectedRoute = (props: ProtectedRouteProps) => {
  const {component} = props;

  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => <Loading />,
  });

  return <Component />;
};
