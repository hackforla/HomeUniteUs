import React from 'react';
import {Avatar as MUIAvatar} from '@mui/material';
import {styled} from '@mui/system';

interface AvatarProps {
  name: string | undefined;
  image: string | undefined;
}

export const Avatar = ({name = 'No Name', image = ''}: AvatarProps) => {
  return (
    <AvatarContainer>
      <MUIAvatar sx={{width: 28, height: 28}} alt={name} src={image} />
    </AvatarContainer>
  );
};

const AvatarContainer = styled('div')(({theme}) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: `1px solid ${theme.palette.grey[400]}`,
  borderRadius: '50%',
  height: 32,
  width: 32,
}));
