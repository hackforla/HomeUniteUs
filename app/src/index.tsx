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
  GuestApplicationTracker,
  HostApplicationTracker,
  SignIn,
  SignUp,
  PrivateView,
} from './views';
import {store} from './app/store';
import {PrivateRoute} from './auth/PrivateRoute';
import {ProtectedView} from './views/ProtectedView';
import {useSessionMutation} from './services/auth';

function Profile() {
  return <div>Hello from profile</div>;
}

function App() {
  const [session] = useSessionMutation();

  const getSession = async () => {
    try {
      await session().unwrap();
    } catch (err) {
      console.log(err);
    }
  };

  // signin to current session if it exists, otherwise fail silently
  React.useEffect(() => {
    getSession();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coord" element={<CoordinatorDashboard />} />
        <Route
          path="/profile"
          element={<ProtectedRoute component={Profile} />}
        />
        <Route
          path="/home/host"
          element={<ProtectedRoute component={HostApplicationTracker} />}
        />
        <Route
          path="/home/guest"
          element={<ProtectedRoute component={GuestApplicationTracker} />}
        />
        <Route
          path="/home/coordinator"
          element={<ProtectedRoute component={CoordinatorDashboard} />}
        />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/private"
          element={
            <PrivateRoute>
              <PrivateView />
            </PrivateRoute>
          }
        />
        <Route
          path="/protected"
          element={
            <PrivateRoute>
              <ProtectedView />
            </PrivateRoute>
          }
        />
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
