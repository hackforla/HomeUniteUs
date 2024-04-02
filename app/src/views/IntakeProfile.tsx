import {Button, Stack} from '@mui/material';
import {Outlet, useParams} from 'react-router-dom';
import {useFieldGroups} from './hooks/useFieldGroups';

export const IntakeProfile = () => {
  const {profileId} = useParams();

  const {answers, fieldGroups} = useFieldGroups({profileId: profileId || ''});

  if (profileId === undefined) return null;

  console.log({answers, fieldGroups});

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
      ></Stack>
      <Stack component="form" sx={{height: '100%', flex: 1}}>
        <Stack sx={{flex: 1, overflowY: 'auto'}}>
          <Outlet />
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
