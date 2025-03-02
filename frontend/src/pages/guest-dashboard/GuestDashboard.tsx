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
    title: 'Application and Onboarding',
    status: 'inProgress',
    subTasks: [
      {
        id: 1,
        title: 'Application',
        status: 'inProgress',
        description:
          'Start your guest application to move on to the next step.',
        linkText: 'Start Application',
        // url: 'profile/1/group/1',
        url: 'profile/guest',
      },
      {
        id: 2,
        title: 'Coordinator Interview',
        status: 'locked',
        description: 'Meet with your Coordinator to share more about yourself.',
        linkText: 'Schedule interview',
        url: '/schedule',
      },
      {
        id: 3,
        title: 'Training Session',
        status: 'locked',
        description:
          'Complete a training session to prepare you for the host home experience.',
        linkText: 'Schedule training',
        url: '/schedule',
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
        linkText: 'Find hosts',
        url: '/match',
      },
      {
        id: 5,
        title: 'Meeting with Host',
        status: 'locked',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        linkText: 'Schedule meeting',
        url: '/schedule',
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
        linkText: 'Sign agreement',
        url: '/schedule',
      },
    ],
  },
];

const coordinatorInfo = {
  image: 'https://placekitten.com/100/100',
  name: 'John Doe',
  email: 'johndoe@email.com',
  phone: '555-555-5555',
};

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
        <Typography sx={{fontSize: 24, fontWeight: 'medium'}} variant="h3">
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
        <Typography sx={{fontSize: 20, fontWeight: 'medium'}} variant="h4">
          My Tasks
        </Typography>
        <Divider sx={{mb: 1}} />
        <Stack spacing={2}>
          {tasks.map(({id, title, status, subTasks}, index) => {
            return (
              <DashboardTaskAccordion
                key={`tastk-${id}`}
                taskOrder={index + 1}
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
