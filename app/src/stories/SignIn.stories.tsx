import {ThemeProvider} from '@emotion/react';
import {Container} from '@mui/material';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {SignInForm} from '../components/common/SignInForm';
import {HomeUniteUsTheme} from '../theme';

export default {
  title: 'Sign In Form',
  component: SignInForm,
  decorators: [
    story => <ThemeProvider theme={HomeUniteUsTheme}>{story()}</ThemeProvider>,
  ],
} as ComponentMeta<typeof SignInForm>;

const Template: ComponentStory<typeof SignInForm> = () => (
  <Container maxWidth="sm">
    <SignInForm
      onSubmit={() => {
        console.log('submit');
      }}
    />
  </Container>
);

export const Primary = Template.bind({});
