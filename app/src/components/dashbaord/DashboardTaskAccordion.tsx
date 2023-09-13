import {useState} from 'react';
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Stack,
  Box,
  useTheme,
  Divider,
} from '@mui/material';
import KeyboardArrowDownOutlined from '@mui/icons-material/KeyboardArrowDownOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import LockIcon from '@mui/icons-material/Lock';

import {Task} from '../../views/GuestApplicationTracker';
import {DashboardTask} from './DashboardTask';

interface OwnProps {
  title: Task['title'];
  status: Task['status'];
  tasks: Task['tasks'];
}

export const TaskAccordion = ({title, status, tasks}: OwnProps) => {
  const [isExpanded, setIsExpanded] = useState(() => status === 'in-progress');

  const theme = useTheme();

  const handleChange = () => {
    setIsExpanded(prev => !prev);
  };

  const completedTasks = tasks.filter(task => task.status === 'complete');

  return (
    <Accordion
      onChange={handleChange}
      expanded={isExpanded}
      sx={{
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
        borderRadius: '4px',
        '&:before': {
          display: 'none',
        },
      }}
      elevation={0}
    >
      <AccordionSummary
        sx={{
          padding: '4px 32px',
          '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
            transform: 'rotate(-90deg)',
          },
          '&:before': {
            display: 'none',
          },
        }}
        expandIcon={<KeyboardArrowDownOutlined />}
        aria-controls="panel1d-content"
        id="panel1d-header"
      >
        <Stack sx={{flexDirection: 'row', marginRight: 'auto', gap: 2}}>
          {status === 'in-progress' && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '20px',
                width: '20px',
                backgroundColor: theme.palette.primary.main,
                borderRadius: '50%',
                color: theme.palette.primary.contrastText,
                fontSize: '12px',
              }}
            >
              1
            </Box>
          )}
          {status === 'locked' && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '20px',
                width: '20px',
                backgroundColor: 'rgba(0, 0, 0, 0.38)',
                borderRadius: '50%',
                color: 'rgba(0, 0, 0, 0.54)',
              }}
            >
              <LockIcon sx={{height: 12}} />
            </Box>
          )}
          {status === 'complete' && <CheckCircleOutlined color="success" />}
          <Typography sx={{fontWeight: 'medium'}}>{title}</Typography>
        </Stack>
        <Typography
          sx={{
            marginRight: 2,
            fontWeight: 'medium',
            fontSize: {xs: '12px', md: '14px'},
          }}
        >
          {completedTasks.length} of {tasks.length} tasks
        </Typography>
      </AccordionSummary>
      <Divider />
      <AccordionDetails sx={{padding: 0}}>
        {tasks.map(({title, description, status}, index) => {
          return (
            <DashboardTask
              key={`${title}-${index}`}
              title={title}
              description={description}
              status={status}
            />
          );
        })}
      </AccordionDetails>
    </Accordion>
  );
};
