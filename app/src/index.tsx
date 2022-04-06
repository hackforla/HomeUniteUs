import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {Provider} from 'react-redux';
import {CssBaseline} from '@mui/material';
import {ThemeProvider} from '@mui/material/styles';
import {StyledEngineProvider} from '@mui/material/styles';

import {HomeUniteUsTheme} from './theme';
import {Auth0ProviderWithHistory, ProtectedRoute} from './auth';
import {
  Home,
  CoordinatorDashboard,
  // GuestApplicationTracker,
  // HostApplicationTracker,
} from './views';
import {store} from './app/store';

function Profile() {
  return <div>Hello from profile</div>;
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/">
          <Home />
        </Route>
        <Route path="/coord">
          <CoordinatorDashboard />
        </Route>
        <Route
          path="/profile"
          element={<ProtectedRoute component={Profile} />}
        />
        {/* <ProtectedRoute path="/home/host" component={HostApplicationTracker} />
        <ProtectedRoute
          path="/home/guest"
          component={GuestApplicationTracker}
        />
        <ProtectedRoute
          path="/home/coordinator"
          component={CoordinatorDashboard}
        /> */}
      </Routes>
    </>
  );
}

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Auth0ProviderWithHistory>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={HomeUniteUsTheme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </StyledEngineProvider>
      </Auth0ProviderWithHistory>
    </BrowserRouter>
  </Provider>,
  document.getElementById('app-root'),
);
