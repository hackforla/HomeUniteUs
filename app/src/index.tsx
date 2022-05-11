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
import {
  Home,
  CoordinatorDashboard,
  GuestApplicationTracker,
  HostApplicationTracker,
  SignIn,
  SignUp,
} from './views';
import {store} from './app/store';
import {ProtectedRoute} from './auth/ProtectedRoute';
import {useSessionMutation} from './services/auth';
import {AccountVerification} from './views/AccountVerification';

function Profile() {
  return <div>Hello from profile</div>;
}

function App() {
  const [session] = useSessionMutation();

  // signin to current session if it exists, otherwise fail silently
  React.useEffect(() => {
    session();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coord" element={<CoordinatorDashboard />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/host"
          element={
            <ProtectedRoute>
              <HostApplicationTracker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guest"
          element={
            <ProtectedRoute>
              <GuestApplicationTracker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coordinator"
          element={
            <ProtectedRoute>
              <CoordinatorDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verification" element={<AccountVerification />} />
      </Routes>
    </>
  );
}

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={HomeUniteUsTheme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </StyledEngineProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById('app-root'),
);
