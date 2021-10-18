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

const drawerWidth = 240;

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
    <Box component="nav">
      <Drawer
        sx={{
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        anchor="left"
        open
        variant="permanent"
      >
        <Box sx={{ minWidth: drawerWidth }} role="presentation">
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
    </Box>
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
    <Box component="main" style={{ paddingTop: "2rem", height: "100%" }}>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            variant="scrollable"
            scrollButtons="auto"
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
    </Box>
  );
}

export function CoordinatorDashboardDetailsPanel() {
  return <UiPlaceholder name="Details Panel" />;
}

export function CoordinatorDashboard(props: CoordinatorDashboardProps) {
  return (
    <CoordinatorDashboardContainer>
      <Grid sx={{ height: "100vh" }} container>
        <Grid item xs={9}>
          <CoordinatorDashboardContentPanel />
        </Grid>
        <Grid item xs={3}>
          <CoordinatorDashboardDetailsPanel />
        </Grid>
      </Grid>
    </CoordinatorDashboardContainer>
  );
}

const CoordinatorDashboardContainer = ({
  children,
}: React.PropsWithChildren<{}>) => {
  return (
    <Box sx={{ width: "100%", height: "100vh" }}>
      <CoordinatorDashboardNav />
      <Box sx={{ display: "flex", paddingLeft: drawerWidth / 8 }}>
        {children}
      </Box>
    </Box>
  );
};
