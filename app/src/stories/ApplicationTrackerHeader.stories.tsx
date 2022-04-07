import React from 'react';
import {ThemeProvider} from '@emotion/react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {ApplicationTrackerHeader} from '../components/common/ApplicationTrackerHeader';
import {HomeUniteUsTheme} from '../theme';
import {Auth0Context, Auth0ContextInterface, User} from '@auth0/auth0-react';

const stub = (): never => {
  throw new Error('You forgot to wrap your component in <Auth0Provider>.');
};

const mockedAuth0Store: Auth0ContextInterface<User> = {
  isAuthenticated: true,
  isLoading: false,
  user: {
    nickname: 'johndoe',
    name: 'johndoe@gmail.com',
    picture:
      'https://s.gravatar.com/avatar/514f68aa9bf4962fdb45b7cd10378eb1?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fer.png',
    updated_at: '2022-04-06T18:45:44.386Z',
    email: 'johndoe@gmail.com',
    email_verified: false,
    sub: 'sub',
    new_entry: '',
    error: undefined,
  },
  buildAuthorizeUrl: stub,
  buildLogoutUrl: stub,
  getAccessTokenSilently: stub,
  getAccessTokenWithPopup: stub,
  getIdTokenClaims: stub,
  loginWithRedirect: stub,
  loginWithPopup: stub,
  logout: stub,
  handleRedirectCallback: stub,
};

interface Auth0ProviderProps {
  value: Auth0ContextInterface<User>;
  children: React.ReactNode;
}

const MockAuth0Provider = ({value, children}: Auth0ProviderProps) => {
  return (
    <Auth0Context.Provider value={value}>{children}</Auth0Context.Provider>
  );
};

export default {
  title: 'Header',
  component: ApplicationTrackerHeader,
  decorators: [
    story => <ThemeProvider theme={HomeUniteUsTheme}>{story()}</ThemeProvider>,
  ],
} as ComponentMeta<typeof ApplicationTrackerHeader>;

const Template: ComponentStory<typeof ApplicationTrackerHeader> = () => (
  <ApplicationTrackerHeader />
);

export const Primary = Template.bind({});
Primary.decorators = [
  story => (
    <MockAuth0Provider value={mockedAuth0Store}>{story()}</MockAuth0Provider>
  ),
];
