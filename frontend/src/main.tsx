import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {Provider} from 'react-redux';
import {CssBaseline, StyledEngineProvider, ThemeProvider} from '@mui/material';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import './index.css';

import {setupStore} from './redux/store';
import {ProtectedRoute} from './features/authentication/ProtectedRoute';
import {useSessionMutation} from './services/auth';
import {HomeUniteUsTheme} from './theme';
import {
  GuestApplicationTracker,
  Home,
  HostApplicationTracker,
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
  CoordinatorDashboard,
  IntakeProfile,
} from './pages';

import {Header} from './features/common';
import {ResetPasswordContext} from './features/authentication/ResetPasswordContext';
import {
  AppLayout,
  CoordinatorDashboardLayout,
  GuestDashboardLayout,
} from './features/layouts';
import {FieldGroupList} from './features/intake-profile/IntakeProfileGroups';
import {enableMocking} from './utils/testing/browser';
import {SystemAdminDashboard} from './pages/SystemAdminDashboard';
import {ProfileReview} from './features/intake-profile/ProfileReview';

function HuuApp() {
  const [session] = useSessionMutation();

  // signin to current session if it exists, otherwise fail silently
  React.useEffect(() => {
    session();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
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
          <Route path="/header" element={<Header />} />
          <Route
            path="/email-verification-success"
            element={<EmailVerificationSuccess />}
          />
          <Route
            path="/email-verification-error"
            element={<EmailVerificationError />}
          />
          <Route path="/create-password" element={<NewPassword />} />
        </Route>
        <Route
          path="/guest"
          element={
            <ProtectedRoute>
              <GuestDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<GuestApplicationTracker />} />
          <Route path="documents" element={<GuestDocuments />} />
          <Route path="contacts" element={<GuestContacts />} />
          <Route path="tasks" element={<GuestTasks />} />
          <Route path="settings" element={<GuestSettings />} />
          <Route
            path="profile/:profileId"
            element={
              <ProtectedRoute>
                <IntakeProfile />
              </ProtectedRoute>
            }
          >
            <Route path="group/:groupId" element={<FieldGroupList />} />
            <Route path="review" element={<ProfileReview />} />
          </Route>
        </Route>
        <Route
          path="/coordinator"
          element={
            <ProtectedRoute>
              <CoordinatorDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CoordinatorDashboard />} />
        </Route>
        <Route
          path="/host"
          element={
            <ProtectedRoute>
              <HostApplicationTracker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <SystemAdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

const appRoot = document.getElementById('root') as HTMLElement;

enableMocking().then(() => {
  ReactDOM.createRoot(appRoot).render(
    <React.StrictMode>
      <Provider store={setupStore()}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <StyledEngineProvider injectFirst>
              <ThemeProvider theme={HomeUniteUsTheme}>
                <CssBaseline />
                <HuuApp />
              </ThemeProvider>
            </StyledEngineProvider>
          </LocalizationProvider>
        </BrowserRouter>
      </Provider>
    </React.StrictMode>,
  );
});
