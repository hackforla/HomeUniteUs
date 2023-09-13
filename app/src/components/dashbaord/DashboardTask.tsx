import {Stack, Box, Typography, Button} from '@mui/material';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import LockIcon from '@mui/icons-material/Lock';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface OwnProps {
  title: string;
  description: string;
  status: 'in-progress' | 'complete' | 'locked';
}

export const DashboardTask = ({title, description, status}: OwnProps) => {
  return (
    <Stack sx={{flexDirection: 'row', px: 4, py: 3, width: '100%'}}>
      <Box sx={{mr: 2}}>
        {status === 'complete' && <CheckCircleOutlined color="success" />}
        {status === 'locked' && (
          <LockIcon sx={{color: 'rgba(0, 0, 0, 0.38)'}} />
        )}
        {status === 'in-progress' && <AccessTimeIcon sx={{color: '#FFC700'}} />}
      </Box>
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
            >
              Start Application
            </Button>
          ) : (
            <Typography>Upcomining</Typography>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};
