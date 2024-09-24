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
import {styled} from '@mui/material/styles';

import {Task} from '../../views/GuestApplicationTracker';
import {DashboardTask} from './DashboardTask';

export interface TaskAccordionProps
  extends Pick<Task, 'title' | 'status' | 'subTasks'> {
  taskOrder: number;
}

export const DashboardTaskAccordion = ({
  taskOrder,
  title,
  status,
  subTasks,
}: TaskAccordionProps) => {
  const [isExpanded, setIsExpanded] = useState(() => status === 'inProgress');

  const handleChange = () => {
    setIsExpanded(prev => !prev);
  };

  const completedTasks = subTasks.filter(task => task.status === 'complete');

  return (
    <StyledAccordion
      onChange={handleChange}
      expanded={isExpanded}
      elevation={0}
    >
      <StyledAccordionSummary
        expandIcon={<KeyboardArrowDownOutlined />}
        aria-controls={`panel${taskOrder}-content`}
        id={`panel${taskOrder}-header`}
      >
        <Stack
          direction="row"
          sx={{marginRight: 'auto', gap: 2, alignItems: 'center'}}
        >
          {status === 'inProgress' && (
            <StyledStepLocked data-testid="stepNumber">
              {taskOrder}
            </StyledStepLocked>
          )}
          {status === 'locked' && (
            <StyledStepNumber>
              <LockIcon sx={{height: 12}} />
            </StyledStepNumber>
          )}
          {status === 'complete' && <CheckCircleOutlined color="success" />}
          <Typography sx={{fontWeight: 'medium'}}>{title}</Typography>
        </Stack>
        <StyledTasksCompleted fontWeight="medium">
          {completedTasks.length} of {subTasks.length} tasks
        </StyledTasksCompleted>
      </StyledAccordionSummary>
      <Divider />
      <AccordionDetails data-testid="tasks" sx={{padding: 0}}>
        {subTasks.map(({id, title, description, status, linkText, url}) => {
          return (
            <DashboardTask
              key={`subtask-${id}`}
              title={title}
              description={description}
              status={status}
              linkText={linkText}
              url={url}
            />
          );
        })}
      </AccordionDetails>
    </StyledAccordion>
  );
};

const StyledAccordion = styled(Accordion)(({theme}) => ({
  boxShadow: theme.shadows[19],
  borderRadius: '4px',
  '&:before': {
    display: 'none',
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)({
  padding: '4px 32px',
  alignItems: 'center',
  '& .MuiAccordionSummary-content': {
    alignItems: 'center',
  },
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
