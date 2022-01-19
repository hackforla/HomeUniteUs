import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {ThemeProvider} from '@mui/material/styles';
import {HomeUniteUsTheme} from '../theme';
import {ApplicationTrackerHeader} from '../components/common';
import {Auth0ProviderWithHistory} from '../auth';

export default {
  title: 'Header',
  component: ApplicationTrackerHeader,
  decorators: [
    story => (
      <Auth0ProviderWithHistory>
        <ThemeProvider theme={HomeUniteUsTheme}>{story()}</ThemeProvider>
      </Auth0ProviderWithHistory>
    ),
  ],
} as ComponentMeta<typeof ApplicationTrackerHeader>;

const Template: ComponentStory<typeof ApplicationTrackerHeader> = () => (
  <ApplicationTrackerHeader />
);
export const LoggedIn = Template.bind({});
