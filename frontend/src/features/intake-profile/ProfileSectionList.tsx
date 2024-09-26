import {
  Stack,
  List,
  ListItem,
  ListItemButton,
  Typography,
  Container,
} from '@mui/material';
import {useParams} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {useStatusStyling} from './hooks/useStatusStyling';
import React from 'react';

import {useGetProfileQuery} from '../../services/profile';

export const ProfileSectionList = () => {
  const statusStyling = useStatusStyling();
  const {profileId} = useParams();

  const {data: profileData, isLoading} = useGetProfileQuery(
    {profileId: profileId},
    {skip: !profileId},
  );
  console.log(profileData);

  if (isLoading || profileData === undefined) return null;

  const {fieldGroups} = profileData;

  return (
    <Container maxWidth="sm">
      <Stack component={List} sx={{px: 2, gap: 2, width: '100%'}}>
        {fieldGroups.map(({id, title}) => {
          // Change status here to see different styles
          // complete | partial | incomplete | locked
          const status = 'incomplete';
          const fieldTitle = title || '...';

          return (
            <ListItem key={id} disableGutters disablePadding>
              <ListItemButton
                to={`${id}`}
                component={Link}
                sx={{
                  borderRadius: 2,
                  backgroundColor: statusStyling[status].color,
                  minHeight: 56,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  paddingInline: 3,
                  borderWidth: 2,
                  borderStyle: 'solid',
                  textDecoration: 'none',
                }}
              >
                {statusStyling[status].icon}
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
