import * as React from 'react';
// import {withAuthenticationRequired} from '@auth0/auth0-react';
import {Loading} from '../components/common';

interface ProtectedRouteProps {
  component: React.ComponentType<unknown>;
  [x: string]: unknown;
}

export const ProtectedRoute = (props: ProtectedRouteProps) => {
  const {component} = props;

  /*
   * TODO:
   *    Tyler 2022-04-27: restore this snippet when an approatiate HOC or alternative auth mechanism established 
   */
  // const Component = withAuthenticationRequired(component, {
  //   onRedirecting: () => <Loading />,
  // });

  const Component = (() => component)();

  return <Component />;
};
