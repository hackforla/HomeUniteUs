import * as React from 'react';
import {Route} from 'react-router-dom';
import {withAuthenticationRequired} from '@auth0/auth0-react';
import {Loading} from '../components/common';

interface ProtectedRouteProps {
  component: React.ComponentType<unknown>;
  [x: string]: unknown;
}

export const ProtectedRoute = (props: ProtectedRouteProps) => {
  const {component, ...args} = props;
  return (
    <Route
      component={withAuthenticationRequired(component, {
        onRedirecting: () => <Loading />,
      })}
      {...args}
    />
  );
};
