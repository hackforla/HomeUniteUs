import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {ThemeProvider} from '@mui/material/styles';
import {HomeUniteUsTheme} from '../theme';

import {Button} from '../components/common/Button';

export default {
  title: 'Button',
  component: Button,
  decorators: [
    story => <ThemeProvider theme={HomeUniteUsTheme}>{story()}</ThemeProvider>,
  ],
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = args => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  label: 'Primary button',
};

export const PrimaryFullWidth = Template.bind({});
PrimaryFullWidth.args = {
  label: 'Primary button',
  fullWidth: true,
};

export const PrimaryDisabled = Template.bind({});
PrimaryDisabled.args = {
  ...Primary.args,
  disabled: true,
};

export const Secondary = Template.bind({});
Secondary.args = {
  label: 'Secondary button',
  variant: 'secondary',
};

export const SecondaryDisabled = Template.bind({});
SecondaryDisabled.args = {
  ...Secondary.args,
  disabled: true,
};
