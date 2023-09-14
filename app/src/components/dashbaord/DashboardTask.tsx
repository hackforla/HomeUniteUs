import {Stack, Box, Typography, Button} from '@mui/material';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import LockIcon from '@mui/icons-material/Lock';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {SubTask, SubTaskIds} from '../../views/GuestApplicationTracker';

const doSomething = () => {
  console.log('do something');
};

interface TaskInfo {
  title: string;
  onClick?: () => void;
}

const taskInfo: {[key in SubTaskIds]: TaskInfo} = {
  submit_application: {
    title: 'Application',
    onClick: doSomething,
  },
  interview_with_coordinator: {
    title: 'Start Application',
    onClick: doSomething,
  },
  attend_training_session: {title: 'Start Application', onClick: doSomething},
  match_with_host: {title: 'Start Application', onClick: doSomething},
  initial_host_meeting: {title: 'Start Application', onClick: doSomething},
  sign_agreement: {title: 'Start Application', onClick: doSomething},
};

export const DashboardTask = ({
  id,
  title,
  description,
  status,
}: Pick<SubTask, 'id' | 'title' | 'description' | 'status'>) => {
  const statusIcons = {
    'in-progress': <AccessTimeIcon sx={{color: '#FFC700'}} />,
    complete: <CheckCircleOutlined color="success" />,
    locked: <LockIcon sx={{color: 'rgba(0, 0, 0, 0.38)'}} />,
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
              onClick={taskInfo[id].onClick}
            >
              {taskInfo[id].title}
            </Button>
          ) : (
            <Typography>Upcomining</Typography>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};
