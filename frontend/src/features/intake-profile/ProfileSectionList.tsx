import React from 'react';
import {
  Stack,
  List,
  ListItem,
  ListItemButton,
  Typography,
  Container,
  Box,
} from '@mui/material';
import {InProgressIcon} from '../ui/icons/InProgressIcon';
import LockIcon from '@mui/icons-material/Lock';
import {CheckCircleOutlined} from '@mui/icons-material';
import {useParams} from 'react-router-dom';
import {Link} from 'react-router-dom';

import {useGetProfileQuery} from '../../services/profile';

const icon = {
  complete: (
    <CheckCircleOutlined
      color="success"
      sx={{backgroundColor: 'white', borderRadius: '50%'}}
    />
  ),
  incomplete: (
    <Box
      sx={{
        width: 24,
        height: 24,
        border: `2px solid white`,
        borderRadius: `100%`,
      }}
    />
  ),
  locked: (
    <LockIcon
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.38)',
        borderRadius: '50%',
        padding: '5px',
        color: 'rgba(0, 0, 0, 0.54)',
      }}
    />
  ),
  partial: <InProgressIcon />,
};

export const ProfileSectionList = () => {
  const {profileId} = useParams();

  const {data: profileData, isLoading} = useGetProfileQuery(
    {profileId: profileId},
    {skip: !profileId},
  );

  if (isLoading || profileData === undefined) return null;

  const {fieldGroups} = profileData;

  return (
    <Container maxWidth="sm">
      <Stack component={List} sx={{px: 2, gap: 2, width: '100%'}}>
        {fieldGroups.map(({id, title}) => {
          // Change status here to see different styles
          // complete | partial | incomplete | locked
          const status = 'complete';
          const fieldTitle = title || '...';

          return (
            <ListItem key={id} disableGutters disablePadding>
              <ListItemButton
                to={`${id}`}
                component={Link}
                sx={{
                  borderRadius: 2,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  py: 2,
                  gap: 2,
                  paddingInline: 3,
                  textDecoration: 'none',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                {icon[status]}
                <Typography
                  sx={{
                    fontSize: 16,
                    color: `palette.text.primary`,
                  }}
                >
                  {fieldTitle}
                </Typography>
              </ListItemButton>
            </ListItem>
          );
        })}
      </Stack>
    </Container>
  );
};
