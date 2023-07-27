import {Poll, ShowChart} from '@mui/icons-material';
import {
  Box,
  Grid,
  useTheme,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

interface GuestDashboardNavItemProps {
  name: string;
}

function GuestDashboardNavItem(
  props: React.PropsWithChildren<GuestDashboardNavItemProps>,
) {
  return (
    <ListItem key={props.name}>
      <ListItemIcon>{props.children}</ListItemIcon>
      <ListItemText primary={props.name} />
    </ListItem>
  );
}

function GuestDashboardNav() {
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
      <GuestDashboardNavItem name="Dashboard">
        <ShowChart />
      </GuestDashboardNavItem>
      <GuestDashboardNavItem name="My Tasks">
        <Poll />
      </GuestDashboardNavItem>
      <GuestDashboardNavItem name="My Documents">
        <Poll />
      </GuestDashboardNavItem>
    </Box>
  );
}

export function GuestDashboard() {
  return (
    <Grid sx={{display: 'flex', flex: 1}} container>
      <Grid item xs={2}>
        <GuestDashboardNav />
      </Grid>
    </Grid>
  );
}
