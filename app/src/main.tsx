import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './index.css';

/*

  import 'core-js/stable';
  import 'regenerator-runtime/runtime';
  import * as React from 'react';
  import * as ReactDOM from 'react-dom';
  import {BrowserRouter, Route, Routes} from 'react-router-dom';
  import {Provider} from 'react-redux';
  import {CssBaseline} from '@mui/material';
  import {ThemeProvider} from '@mui/material/styles';
  import {StyledEngineProvider} from '@mui/material/styles'; 

*/

import {CssBaseline, StyledEngineProvider, ThemeProvider} from '@mui/material';
import {Provider} from 'react-redux';
import {store} from './app/store';
import {ProtectedRoute} from './auth/ProtectedRoute';
import {useSessionMutation} from './services/auth';
import {HomeUniteUsTheme} from './theme';
import {
  CoordinatorDashboard,
  GuestApplicationTracker,
  Home,
  HostApplicationTracker,
  HostsList,
  SignIn,
  SignUp,
  ForgotPassword,
  ResetPassword,
  EmailVerificationSuccess,
} from './views';
import {AccountVerification} from './views/AccountVerification';
import {AppLayout, Header} from './components/common';
// import { ApprovalTwoTone } from '@mui/icons-material';

function Profile() {
  return <div>Hello from profile</div>;
}

function HuuApp() {
  const [session] = useSessionMutation();

  // signin to current session if it exists, otherwise fail silently
  React.useEffect(() => {
    session();
  }, []);

  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/coord" element={<CoordinatorDashboard />} />
          <Route path="/hosts" element={<HostsList />} />
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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/header" element={<Header />} />
          <Route
            path="/email-verification-success"
            element={<EmailVerificationSuccess />}
          />
        </Route>
      </Routes>
    </>
  );
}

const appRoot = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(appRoot).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={HomeUniteUsTheme}>
            <CssBaseline />
            <HuuApp />
          </ThemeProvider>
        </StyledEngineProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
