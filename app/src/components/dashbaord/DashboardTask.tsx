import {Stack, Box, Typography} from '@mui/material';
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
    <Stack sx={{flexDirection: 'row', px: 4, py: 3, width: '100%', gap: 2}}>
      <Box>
        {status === 'complete' && <CheckCircleOutlined color="success" />}
        {status === 'locked' && (
          <LockIcon sx={{color: 'rgba(0, 0, 0, 0.38)'}} />
        )}
        {status === 'in-progress' && <AccessTimeIcon sx={{color: '#FFC700'}} />}
      </Box>
      <Stack>
        <Typography sx={{fontWeight: 'medium'}}>{title}</Typography>
        <Typography>{description}</Typography>
      </Stack>
    </Stack>
  );
};
