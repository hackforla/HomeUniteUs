import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './index.css';

import {CssBaseline, StyledEngineProvider, ThemeProvider} from '@mui/material';
import {Provider} from 'react-redux';
import {setupStore} from './app/store';
import {ProtectedRoute} from './components/authentication/ProtectedRoute';
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
  EmailVerificationError,
  NewPassword,
  ForgotPasswordCode,
  ForgotPasswordSuccess,
  Settings,
  SelectAccountType,
  ConfirmSignUp,
  GuestDocuments,
  GuestContacts,
  GuestTasks,
  GuestSettings,
} from './views';
import {AccountVerification} from './views/AccountVerification';
import {AppLayout, Header} from './components/common';
import {ResetPasswordContext} from './components/authentication/ResetPasswordContext';
import {GuestDashboardlayout} from './components/layout/GuestDashboardlayout';

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
          <Route path="/settings" element={<Settings />} />
          <Route path="/signin" element={<SignIn />} />

          <Route path="/signup" element={<SelectAccountType />} />
          <Route path="/signup/:type" element={<SignUp />} />
          <Route path="/signup/success" element={<ConfirmSignUp />} />
          <Route path="/forgot-password" element={<ResetPasswordContext />}>
            <Route index element={<ForgotPassword />} />
            <Route path="code" element={<ForgotPasswordCode />} />
            <Route path="reset" element={<ResetPassword />} />
          </Route>
          <Route
            path="/forgot-password/success"
            element={<ForgotPasswordSuccess />}
          />
          <Route path="/verification" element={<AccountVerification />} />
          <Route path="/header" element={<Header />} />
          <Route
            path="/email-verification-success"
            element={<EmailVerificationSuccess />}
          />
          <Route
            path="/email-verification-error"
            element={<EmailVerificationError />}
          />
          <Route path="/new-password" element={<NewPassword />} />
          <Route
            path="/host"
            element={
              <ProtectedRoute>
                <HostApplicationTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route
          path="/guest"
          element={
            <ProtectedRoute>
              <GuestDashboardlayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<GuestApplicationTracker />} />
          <Route path="documents" element={<GuestDocuments />} />
          <Route path="contacts" element={<GuestContacts />} />
          <Route path="tasks" element={<GuestTasks />} />
          <Route path="settings" element={<GuestSettings />} />
        </Route>
        <Route
          path="/coordinator"
          element={
            <ProtectedRoute>
              <CoordinatorDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

const appRoot = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(appRoot).render(
  <React.StrictMode>
    <Provider store={setupStore()}>
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
