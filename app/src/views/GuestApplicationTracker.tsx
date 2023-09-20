import {Divider, Box, Typography, Stack, useTheme} from '@mui/material';
import {styled} from '@mui/system';
import {TaskAccordion} from '../components/dashboard/DashboardTaskAccordion';

export type TaskStatus = 'in-progress' | 'complete' | 'locked';

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  subTasks: SubTask[];
}

export interface SubTask {
  id: number;
  title: string;
  status: TaskStatus;
  description: string;
  buttonTitle: string;
  route: string;
}

const tasks: Task[] = [
  {
    id: 1,
    title: 'Application and Onboarding',
    status: 'in-progress',
    subTasks: [
      {
        id: 1,
        title: 'Application',
        status: 'complete',
        description:
          'Start your guest application to move on to the next step.',
        buttonTitle: 'Start Application',
        route: '/guest-application',
      },
      {
        id: 2,
        title: 'Coordinator Interview',
        status: 'in-progress',
        description: 'Meet with your Coordinator to share more about yourself.',
        buttonTitle: 'Schedule interview',
        route: '/schedule',
      },
      {
        id: 3,
        title: 'Training Session',
        status: 'locked',
        description:
          'Complete a training session to prepare you for the host home experience.',
        buttonTitle: 'Schedule training',
        route: '/schedule',
      },
    ],
  },
  {
    id: 2,
    title: 'Host Matching',
    status: 'locked',
    subTasks: [
      {
        id: 4,
        title: 'Match with a Host',
        status: 'locked',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        buttonTitle: 'Find hosts',
        route: '/match',
      },
      {
        id: 5,
        title: 'Meeting with Host',
        status: 'locked',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        buttonTitle: 'Schedule meeting',
        route: '/schedule',
      },
    ],
  },
  {
    id: 3,
    title: 'Match Finalized',
    status: 'locked',
    subTasks: [
      {
        id: 6,
        title: 'Sign Agreement',
        status: 'locked',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        buttonTitle: 'Sign agreement',
        route: '/schedule',
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
          {tasks.map(({id, title, status, subTasks}, index) => {
            return (
              <TaskAccordion
                key={`tastk-${id}`}
                stepNumber={index + 1}
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
  padding: `${theme.spacing(6)} ${theme.spacing(3)}`,
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
