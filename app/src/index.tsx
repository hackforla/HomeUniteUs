import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Auth0Provider } from './react-auth0-spa';
import history from './utils/history';

  

import "./index.css"

import { App } from "./App"

window.addEventListener("load", function() {
  console.log(`window:load: about to render app...`)
  
  const auth0Domain = process.env.AUTH0_DOMAIN;
  const auth0ClientId = process.env.AUTH0_CLIENT_ID;
  const auth0RedirectUri = window.location.origin;

  console.log(`window:load: auth0Domain        = ${auth0Domain}`);
  console.log(`window:load: auth0ClientId      = ${auth0ClientId}`);
  console.log(`window:load: auth0RedirectUri   = ${auth0RedirectUri}`);
  
  // if (
  //   auth0Domain === undefined
  //   || auth0ClientId === undefined
  //   || auth0Audience === undefined
  // ) {
  //   throw new Error('missing env vars');
  // }
  
  const onAuthRedirectCallback = (redirectResult?: RedirectLoginResult) => {
    console.log(
      'auth0 onRedirectCallback called with redirectState %o',
      redirectResult
    );
  
    // Clears auth0 query string parameters from url
    const targetUrl = redirectResult
      && redirectResult.appState
      && redirectResult.appState.targetUrl
        ? redirectResult.appState.targetUrl
        : window.location.pathname;
        
    history.push(targetUrl);
  };
  
  ReactDOM.render(
    (
      <Auth0Provider
        domain={auth0Domain || ''}
        client_id={auth0ClientId || ''}
        redirect_uri={auth0RedirectUri || ''}
        // audience={auth0Audience}
        onRedirectCallback={onAuthRedirectCallback}
      >
        <App />
      </Auth0Provider>
    ),
    document.getElementById('app-root')
  );


  console.log(`window:load: app rendered`);
})
