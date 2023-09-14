import {useState} from 'react';
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Stack,
  Box,
  Divider,
} from '@mui/material';
import KeyboardArrowDownOutlined from '@mui/icons-material/KeyboardArrowDownOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import LockIcon from '@mui/icons-material/Lock';
import {styled} from '@mui/system';

import {Task} from '../../views/GuestApplicationTracker';
import {DashboardTask} from './DashboardTask';

interface OwnProps {
  title: Task['title'];
  status: Task['status'];
  tasks: Task['tasks'];
}

export const TaskAccordion = ({title, status, tasks}: OwnProps) => {
  const [isExpanded, setIsExpanded] = useState(() => status === 'in-progress');

  const handleChange = () => {
    setIsExpanded(prev => !prev);
  };

  const completedTasks = tasks.filter(task => task.status === 'complete');

  return (
    <StyledAccordion
      onChange={handleChange}
      expanded={isExpanded}
      elevation={0}
    >
      <StyledAccordionSummary
        expandIcon={<KeyboardArrowDownOutlined />}
        aria-controls="panel1d-content"
        id="panel1d-header"
      >
        <Stack direction="row" sx={{marginRight: 'auto', gap: 2}}>
          {status === 'in-progress' && <StyledStepLocked>1</StyledStepLocked>}
          {status === 'locked' && (
            <StyledStepNumber>
              <LockIcon sx={{height: 12}} />
            </StyledStepNumber>
          )}
          {status === 'complete' && <CheckCircleOutlined color="success" />}
          <Typography sx={{fontWeight: 'medium'}}>{title}</Typography>
        </Stack>
        <StyledTasksCompleted fontWeight="medium">
          {completedTasks.length} of {tasks.length} tasks
        </StyledTasksCompleted>
      </StyledAccordionSummary>
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
    </StyledAccordion>
  );
};

const StyledAccordion = styled(Accordion)({
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
  borderRadius: '4px',
  '&:before': {
    display: 'none',
  },
});

const StyledAccordionSummary = styled(AccordionSummary)({
  padding: '4px 32px',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(-90deg)',
  },
  '&:before': {
    display: 'none',
  },
});

const Step = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '20px',
  width: '20px',
  borderRadius: '50%',
});

const StyledStepNumber = styled(Step)({
  backgroundColor: 'rgba(0, 0, 0, 0.38)',
  color: 'rgba(0, 0, 0, 0.54)',
});

const StyledStepLocked = styled(Step)(({theme}) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontSize: '12px',
}));

const StyledTasksCompleted = styled(Typography)(({theme}) => ({
  width: 'min-content',
  whiteSpace: 'nowrap',
  [theme.breakpoints.up('xs')]: {
    marginRight: theme.spacing(1),
    fontSize: '12px',
  },
  [theme.breakpoints.up('md')]: {
    marginRight: theme.spacing(2),
    fontSize: '14px',
  },
}));
