import "core-js/stable";
import "regenerator-runtime/runtime";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Auth0ProviderWithHistory, ProtectedRoute } from "./auth";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { StyledEngineProvider } from "@mui/material/styles";

import { HomeUniteUsTheme } from "./theme";
import {
  Home,
  CoordinatorDashboard,
  GuestApplicationTracker,
  HostApplicationTracker,
} from "./views";
import { Box } from "@mui/system";

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
