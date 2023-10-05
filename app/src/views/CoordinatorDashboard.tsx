import * as React from 'react';
import {Home, Settings, ShowChart} from '@mui/icons-material';
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import {UiPlaceholder} from '../components/common/UiPlaceholder';
import {GuestInviteButton} from '../components/common/GuestInviteButton';

interface CoordinatorDashboardProps {}
interface CoordinatorDashboardNavProps {}
interface CoordinatorDashboardNavItemProps {
  name: string;
}

interface CoordinatorDashboardChildNavItemProps {
  name: string;
}

const tabOptions = [
  'Overview',
  'Applications',
  'Guests',
  'Hosts',
  'Matches',
  'Holding Zone',
];

export function CoordinatorDashboardNavItem(
  props: React.PropsWithChildren<CoordinatorDashboardNavItemProps>,
) {
  return (
    <ListItem button key={props.name}>
      <ListItemIcon>{props.children}</ListItemIcon>
      <ListItemText primary={props.name} />
    </ListItem>
  );
}

export function CoordinatorDashboardChildNavItem({
  name,
}: CoordinatorDashboardChildNavItemProps) {
  return (
    <ListItem button key={name}>
      <ListItemText sx={{paddingLeft: '3.6rem'}} primary={name} />
    </ListItem>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CoordinatorDashboardNav(props: CoordinatorDashboardNavProps) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        paddingTop: '2rem',
        borderRight: `1px solid ${theme.palette.grey[300]}`,
        height: '100%',
      }}
      component="nav"
    >
      <Box role="presentation">
        <List>
          <CoordinatorDashboardNavItem name="Home">
            <Home />
          </CoordinatorDashboardNavItem>
          {tabOptions.map(name => {
            return <CoordinatorDashboardChildNavItem key={name} name={name} />;
          })}
          <CoordinatorDashboardNavItem name="Activity">
            <ShowChart />
          </CoordinatorDashboardNavItem>
          <CoordinatorDashboardNavItem name="Settings">
            <Settings />
          </CoordinatorDashboardNavItem>
        </List>
      </Box>
    </Box>
  );
}

export function CoordinatorDashboardContentPanel() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        padding: '2rem',
        height: '100%',
        width: '100%',
      }}
    >
      <Box
        sx={{
          backgroundColor: theme.palette.grey[300],
          height: '100%',
          width: '100%',
        }}
      ></Box>
    </Box>
  );
}

export function CoordinatorDashboardDetailsPanel() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        padding: '2rem',
        borderLeft: `1px solid ${theme.palette.grey[300]}`,
      }}
    >
      <UiPlaceholder name="Details Panel" />
    </Box>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CoordinatorDashboard(props: CoordinatorDashboardProps) {
  return (
    <Grid sx={{display: 'flex', flex: 1}} container>
      <Grid item xs={2}>
        <CoordinatorDashboardNav />
      </Grid>
      <Grid item xs={8}>
        <CoordinatorDashboardContentPanel />
      </Grid>
      <Grid item xs={2}>
        <GuestInviteButton />
        <CoordinatorDashboardDetailsPanel />
      </Grid>
    </Grid>
  );
}
