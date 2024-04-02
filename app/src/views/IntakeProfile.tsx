import {Button, Stack} from '@mui/material';
import {Link, Outlet, useParams} from 'react-router-dom';
import {useFieldGroups} from './hooks/useFieldGroups';

export const IntakeProfile = () => {
  const {profileId, groupId} = useParams();

  const {fieldGroups} = useFieldGroups({profileId: profileId || ''});

  if (profileId === undefined || groupId === undefined) return null;

  return (
    <Stack
      direction="row"
      sx={{
        height: '100vh',
        width: '100vw',
        backgroundColor: 'grey.50',
      }}
    >
      <Stack
        sx={{
          gap: 1,
          p: 1,
          height: '100%',
          width: '256px',
          borderRight: '1px solid',
          borderColor: 'grey.200',
          backgroundColor: 'background.default',
        }}
      >
        {fieldGroups.map(({id, title}) => {
          const fieldTitle = title || '...';
          return (
            <Button
              key={id}
              variant="contained"
              to={`group/${id}`}
              component={Link}
              color="inherit"
            >
              {fieldTitle}
            </Button>
          );
        })}
      </Stack>
      <Stack component="form" sx={{height: '100%', flex: 1}}>
        <Stack sx={{flex: 1, overflowY: 'auto'}}>
          <Outlet context={{groupId, fieldGroups}} />
        </Stack>
        <Stack sx={{p: 1}}>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};
