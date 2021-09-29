import * as React from "react";
import { Home, Person, Settings, ShowChart } from "@mui/icons-material";
import {
  Box,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import { UiPlaceholder } from "../components/common/UiPlaceholder";

interface CoordinatorDashboardProps {}
interface CoordinatorDashboardNavProps {}
interface CoordinatorDashboardNavItemProps {
  name: string;
}

export function CoordinatorDashboardNavItem(
  props: React.PropsWithChildren<CoordinatorDashboardNavItemProps>
) {
  return (
    <ListItem button key={props.name}>
      <ListItemIcon>{props.children}</ListItemIcon>
      <ListItemText primary={props.name} />
    </ListItem>
  );
}

export function CoordinatorDashboardNav(props: CoordinatorDashboardNavProps) {
  return (
    <nav>
      <Drawer anchor="left" open variant="permanent">
        <Box sx={{ minWidth: 250 }} role="presentation">
          <Box sx={{ display: { xs: "flex" }, padding: "2rem 50px" }}>
            <img src="/img/huu.svg" width="150" />
          </Box>
          <List>
            <CoordinatorDashboardNavItem name="Home">
              <Home />
            </CoordinatorDashboardNavItem>
            <CoordinatorDashboardNavItem name="My Profile">
              <Person />
            </CoordinatorDashboardNavItem>
            <CoordinatorDashboardNavItem name="Activity">
              <ShowChart />
            </CoordinatorDashboardNavItem>
            <CoordinatorDashboardNavItem name="Settings">
              <Settings />
            </CoordinatorDashboardNavItem>
          </List>
        </Box>
      </Drawer>
    </nav>
  );
}

export function CoordinatorDashboardContentPanel() {
  const [selectedItem, setSelectedItem] = React.useState(0);

  function handleTabClicked(event: React.SyntheticEvent, itemIndex: number) {
    setSelectedItem(itemIndex);
  }

  const tabOptions = [
    "Overview",
    "Applications",
    "Guests",
    "Hosts",
    "Matches",
    "Holding Zone",
  ];

  return (
    <main style={{ paddingTop: "2rem" }}>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            aria-label="basic tabs example"
            value={selectedItem}
            onChange={handleTabClicked}
          >
            {tabOptions.map((tabOption: string) => (
              <Tab key={tabOption} label={tabOption} />
            ))}
          </Tabs>
        </Box>
      </Box>
    </main>
  );
}

export function CoordinatorDashboardDetailsPanel() {
  return <UiPlaceholder name="Details Panel" />;
}

export function CoordinatorDashboard(props: CoordinatorDashboardProps) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={2}>
        <CoordinatorDashboardNav />
      </Grid>
      <Grid item xs={8}>
        <CoordinatorDashboardContentPanel />
      </Grid>
      <Grid item xs={2}>
        <CoordinatorDashboardDetailsPanel />
      </Grid>
    </Grid>
  );
}
