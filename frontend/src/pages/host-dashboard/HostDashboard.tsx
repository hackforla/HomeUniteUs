/* eslint-disable */
import {Divider, Box, Typography, Stack, useTheme} from '@mui/material';
import {styled} from '@mui/system';
import {
  DashboardTaskAccordion,
  CoordinatorContact,
} from '../../features/guest-dashboard';

export type TaskStatus = 'inProgress' | 'complete' | 'locked';

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
  linkText: string;
  url: string;
}

const tasks: Task[] = [
  {
    id: 1,
    title: 'Profile and Onboarding',
    status: 'inProgress',
    subTasks: [
      {
        id: 1,
        title: 'Host Profile',
        status: 'inProgress',
        description: 'Set up your host profile to get started.',
        linkText: 'Start Application',
        url: '/host/welcome',
      },
      {
        id: 2,
        title: 'Coordinator Interview',
        status: 'locked',
        description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
        linkText: 'Submit Check',
        url: '/host/background-check',
      },
      {
        id: 3,
        title: 'Training Session',
        status: 'locked',
        description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
        linkText: 'Submit Check',
        url: '/host/background-check',
      },
    ],
  },
  {
    id: 2,
    title: 'Guest Matching',
    status: 'locked',
    subTasks: [
      {
        id: 3,
        title: 'Review Guest Applications',
        status: 'locked',
        description: 'Browse and review incoming guest applications.',
        linkText: 'View Guests',
        url: '/host/match',
      },
    ],
  },
  {
    id: 3,
    title: 'Match Finalized',
    status: 'locked',
    subTasks: [
      {
        id: 4,
        title: 'Sign Agreement',
        status: 'locked',
        description: 'Review and sign the host agreement.',
        linkText: 'Sign Agreement',
        url: '/host/agreement',
      },
    ],
  },
];

const coordinatorInfo = {
  image: 'https://placekitten.com/100/100',
  name: 'Jane Smith',
  email: 'janesmith@email.com',
  phone: '555-123-4567',
};

export function HostDashboard() {
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
        <Typography sx={{fontSize: 24, fontWeight: 'medium'}} variant="h3">
          Welcome, Jane Doe!
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
        <Typography sx={{fontSize: 20, fontWeight: 'medium'}} variant="h4">
          Host Tasks
        </Typography>
        <Divider sx={{mb: 1}} />
        <Stack spacing={2}>
          {tasks.map(({id, title, status, subTasks}, index) => (
            <DashboardTaskAccordion
              key={`task-${id}`}
              taskOrder={index + 1}
              title={title}
              status={status}
              subTasks={subTasks}
            />
          ))}
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
          <Typography sx={{fontSize: 20, fontWeight: 'medium'}} variant="h4">
            Contacts
          </Typography>
          <Divider sx={{mb: 1}} />
          <CoordinatorContact
            image={coordinatorInfo.image}
            name={coordinatorInfo.name}
            email={coordinatorInfo.email}
            phone={coordinatorInfo.phone}
          />
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
