import React from 'react';
import {useAuth0} from '@auth0/auth0-react';

import {ApplicationTrackerHeader} from '../components/common';
import {render, screen, userEvent} from '../utils/test/test-utils';

jest.mock('@auth0/auth0-react');

const setup = () => {
  (useAuth0 as jest.Mock).mockReturnValue({
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
  });

  render(<ApplicationTrackerHeader />);
};

describe('ApplicationTrackerHeader', () => {
  it('should show menu when clicking on account icon', () => {
    setup();
    const button = screen.getByRole('button', {name: /account/i});
    userEvent.click(button);
  });
});
