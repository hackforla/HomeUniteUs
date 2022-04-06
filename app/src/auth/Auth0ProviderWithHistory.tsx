import * as React from 'react';
import {useNavigate} from 'react-router-dom';
import {AppState, Auth0Provider} from '@auth0/auth0-react';

interface Auth0ProviderWithHistoryProps {}

export const Auth0ProviderWithHistory = (
  props: React.PropsWithChildren<Auth0ProviderWithHistoryProps>,
) => {
  const navigate = useNavigate();
  const domain = process.env.AUTH0_DOMAIN || 'UNASSIGNED';
  const clientId = process.env.AUTH0_CLIENT_ID || 'UNASSIGNED';
  const audience = process.env.AUTH0_AUDIENCE;

  const onRedirectCallback = (appState: AppState) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
      audience={audience}
    >
      {props.children}
    </Auth0Provider>
  );
};
