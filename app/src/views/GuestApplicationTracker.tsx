import {Divider, Box, Typography, Stack, useTheme} from '@mui/material';
import {styled} from '@mui/system';
import {TaskAccordion} from '../components/dashbaord/DashboardTaskAccordion';

export interface Task {
  title: string;
  status: 'in-progress' | 'complete' | 'locked';
  tasks: {
    title: string;
    status: 'in-progress' | 'complete' | 'locked';
    description: string;
  }[];
}

const tasks: Task[] = [
  {
    title: 'Application and Onboarding',
    status: 'in-progress',
    tasks: [
      {
        title: 'Application',
        status: 'complete',
        description:
          'Start your guest application to move on to the next step.',
      },
      {
        title: 'Coordinator Interview',
        status: 'in-progress',
        description: 'Meet with your Coordinator to share more about yourself.',
      },
      {
        title: 'Training Session',
        status: 'locked',
        description:
          'Complete a training session to prepare you for the host home experience.',
      },
    ],
  },
  {
    title: 'Host Matching',
    status: 'locked',
    tasks: [
      {
        title: 'Application',
        status: 'locked',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
      {
        title: 'Application',
        status: 'locked',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
    ],
  },
  {
    title: 'Match Finalized',
    status: 'locked',
    tasks: [
      {
        title: 'Application',
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
          {tasks.map(({title, status, tasks}, index) => {
            return (
              <TaskAccordion
                key={`task-accordion-${index}`}
                title={title}
                status={status}
                tasks={tasks}
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
