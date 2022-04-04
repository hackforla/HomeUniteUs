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
      <MUIAvatar sx={{width: 46, height: 46}} alt={name} src={image} />
    </AvatarContainer>
  );
};

const AvatarContainer = styled('div')(({theme}) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: `1px solid ${theme.palette.grey[400]}`,
  borderRadius: '50%',
  height: 50,
  width: 50,
}));
