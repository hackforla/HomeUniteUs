import {Stack, Box, Typography, Button} from '@mui/material';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import LockIcon from '@mui/icons-material/Lock';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {useNavigate} from 'react-router-dom';

import {SubTask} from '../../views/GuestApplicationTracker';

export type DashboardTaskProps = Pick<
  SubTask,
  'title' | 'description' | 'status' | 'buttonTitle' | 'route'
>;

export const DashboardTask = ({
  title,
  description,
  status,
  buttonTitle,
  route,
}: DashboardTaskProps) => {
  const navigate = useNavigate();

  const statusIcons = {
    'in-progress': <AccessTimeIcon sx={{color: '#FFC700'}} />,
    complete: <CheckCircleOutlined color="success" />,
    locked: <LockIcon sx={{color: 'rgba(0, 0, 0, 0.38)'}} />,
  };

  const handleClick = () => {
    navigate(route);
  };

  return (
    <Stack sx={{flexDirection: 'row', px: 4, py: 3, width: '100%'}}>
      <Box sx={{mr: 2}}>{statusIcons[status]}</Box>
      <Stack
        sx={{
          flex: 1,
          flexDirection: {xs: 'column', sm: 'row'},
          gap: {xs: 2, sm: 3},
        }}
      >
        <Stack sx={{flex: 1}}>
          <Typography sx={{fontWeight: 'medium'}}>{title}</Typography>
          <Typography sx={{color: '#999999'}}>{description}</Typography>
        </Stack>
        <Stack
          sx={{width: '177px', justifyContent: 'center', alignItems: 'center'}}
        >
          {status === 'in-progress' || status === 'complete' ? (
            <Button
              fullWidth
              size="medium"
              variant="contained"
              disabled={status === 'complete'}
              onClick={handleClick}
            >
              {buttonTitle}
            </Button>
          ) : (
            <Typography>Upcomining</Typography>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};
