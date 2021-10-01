import "core-js/stable";
import "regenerator-runtime/runtime";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter, NavLink, Route, Switch } from "react-router-dom";
import { Auth0ProviderWithHistory, ProtectedRoute } from "./auth";
import {
  Checkbox,
  Container,
  CssBaseline,
  Grid,
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import { StyledEngineProvider } from "@mui/material/styles";

import { HomeUniteUsTheme } from "./theme";
import {
  CoordinatorDashboard,
  GuestApplicationTracker,
  HostApplicationTracker,
} from "./views";
import { Box } from "@mui/system";

function TempBtn(props: { name: string }) {
  return (
    <Box
      sx={{
        padding: "3rem 5rem",
        bgcolor: "#6cccff",
      }}
    >
      <Typography>{props.name}</Typography>
    </Box>
  );
}

function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#249BE5",
        flex: 1,
        justifyContent: "space-evenly",
        alignItems: "center",
      }}
    >
      <NavLink to="/home/guest">
        <TempBtn name="Guest" />
      </NavLink>
      <NavLink to="/home/host">
        <TempBtn name="Host" />
      </NavLink>
      <NavLink to="/home/coordinator">
        <TempBtn name="Coordinator" />
      </NavLink>
    </div>
  );
}

function Profile() {
  return <div>Hello from profile</div>;
}

function App() {
  return (
    <>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/coord" component={CoordinatorDashboard} />
        <ProtectedRoute path="/profile" component={Profile} />
        <ProtectedRoute path="/home/host" component={HostApplicationTracker} />
        <ProtectedRoute
          path="/home/guest"
          component={GuestApplicationTracker}
        />
        <ProtectedRoute
          path="/home/coordinator"
          component={CoordinatorDashboard}
        />
      </Switch>
    </>
  );
}

ReactDOM.render(
  <BrowserRouter>
    <Auth0ProviderWithHistory>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={HomeUniteUsTheme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </StyledEngineProvider>
    </Auth0ProviderWithHistory>
  </BrowserRouter>,
  document.getElementById("app-root")
);
