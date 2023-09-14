import {Divider, Box, Typography, Stack, useTheme} from '@mui/material';
import {styled} from '@mui/system';
import {TaskAccordion} from '../components/dashbaord/DashboardTaskAccordion';

export type TaskStatus = 'in-progress' | 'complete' | 'locked';

export type TaskIds =
  | 'application_and_onboarding'
  | 'host_matching'
  | 'host_match_finalization';

export type SubTaskIds =
  | 'submit_application'
  | 'interview_with_coordinator'
  | 'attend_training_session'
  | 'match_with_host'
  | 'initial_host_meeting'
  | 'sign_agreement';

export interface SubTask {
  id: SubTaskIds;
  title: string;
  status: TaskStatus;
  description: string;
}

export interface Task {
  id: TaskIds;
  title: string;
  status: TaskStatus;
  subTasks: SubTask[];
}

const tasks: Task[] = [
  {
    id: 'application_and_onboarding',
    title: 'Application and Onboarding',
    status: 'in-progress',
    subTasks: [
      {
        id: 'submit_application',
        title: 'Application',
        status: 'complete',
        description:
          'Start your guest application to move on to the next step.',
      },
      {
        id: 'interview_with_coordinator',
        title: 'Coordinator Interview',
        status: 'in-progress',
        description: 'Meet with your Coordinator to share more about yourself.',
      },
      {
        id: 'attend_training_session',
        title: 'Training Session',
        status: 'locked',
        description:
          'Complete a training session to prepare you for the host home experience.',
      },
    ],
  },
  {
    id: 'host_matching',
    title: 'Host Matching',
    status: 'locked',
    subTasks: [
      {
        id: 'match_with_host',
        title: 'Match with a Host',
        status: 'locked',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
      {
        id: 'initial_host_meeting',
        title: 'Meeting with Host',
        status: 'locked',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
    ],
  },
  {
    id: 'host_match_finalization',
    title: 'Match Finalized',
    status: 'locked',
    subTasks: [
      {
        id: 'sign_agreement',
        title: 'Sign Agreement',
        status: 'locked',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
    ],
  },
];

export function GuestApplicationTracker() {
  const theme = useTheme();
  const toolbarHeight = Number(theme.mixins.toolbar.minHeight);

  return (
    <StyledPageContainer toolbarHeight={toolbarHeight}>
      <Box
        sx={{
          display: {xs: 'none', md: 'block'},
          gridColumn: {
            sm: '1 / 5',
            md: '1 / 9',
            lg: '2 / 12',
          },
          mb: 5,
        }}
      >
        <Typography sx={{fontSize: 24}} variant="h3">
          Welcome, Jane Doe
        </Typography>
        <Divider />
      </Box>

      <Box
        sx={{
          gridColumn: {
            sm: '1 / 5',
            md: '1 / 9',
            lg: '2 / 8',
          },
        }}
      >
        <Typography sx={{fontSize: 20}} variant="h4">
          My Tasks
        </Typography>
        <Divider sx={{mb: 1}} />
        <Stack spacing={2}>
          {tasks.map(({id, title, status, subTasks}) => {
            return (
              <TaskAccordion
                key={id}
                title={title}
                status={status}
                subTasks={subTasks}
              />
            );
          })}
        </Stack>
      </Box>
      <Box
        sx={{
          display: {xs: 'none', lg: 'block'},
          gridColumn: {
            lg: '8 / 12',
          },
        }}
      >
        <Box>
          <Typography sx={{fontSize: 20}} variant="h4">
            Contacts
          </Typography>
          <Divider sx={{mb: 1}} />
          <Box
            sx={{backgroundColor: 'dodgerblue', width: '100%', height: '200px'}}
          ></Box>
        </Box>
      </Box>
    </StyledPageContainer>
  );
}

interface StyledPageContainerProps {
  toolbarHeight: number;
}

const StyledPageContainer = styled(Box, {
  shouldForwardProp: prop => prop !== 'toolbarHeight',
})<StyledPageContainerProps>(({toolbarHeight, theme}) => ({
  height: `calc(100vh - ${toolbarHeight}px)`,
  backgroundColor: theme.palette.grey[50],
  overflowY: 'scroll',
  display: 'grid',
  padding: theme.spacing(3),
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(8, 1fr)',
  },
  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(12, 1fr)',
  },
  gridAutoRows: 'min-content',
  gridColumnGap: theme.spacing(3),
}));
