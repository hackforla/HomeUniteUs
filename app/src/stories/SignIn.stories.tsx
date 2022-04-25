import {ThemeProvider} from '@emotion/react';
import {ComponentMeta} from '@storybook/react';
import {HomeUniteUsTheme} from '../theme';
import {SignIn} from '../views';

export default {
  title: 'SignIn',
  component: SignIn,
  decorators: [
    story => <ThemeProvider theme={HomeUniteUsTheme}>{story()}</ThemeProvider>,
  ],
} as ComponentMeta<typeof SignIn>;
