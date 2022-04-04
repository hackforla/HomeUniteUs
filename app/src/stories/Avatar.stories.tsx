import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import {Avatar} from '../components/common/Avatar';
import {ThemeProvider} from '@mui/material/styles';
import {HomeUniteUsTheme} from '../theme';

export default {
  title: 'Avatar',
  component: Avatar,
  decorators: [
    story => <ThemeProvider theme={HomeUniteUsTheme}>{story()}</ThemeProvider>,
  ],
} as ComponentMeta<typeof Avatar>;

const Template: ComponentStory<typeof Avatar> = args => <Avatar {...args} />;

export const WithImage = Template.bind({});
WithImage.args = {
  image:
    'https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light',
};

export const WithoutImage = Template.bind({});
WithoutImage.args = {};
