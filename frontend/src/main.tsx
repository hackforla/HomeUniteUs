import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {Provider} from 'react-redux';
import {CssBaseline, StyledEngineProvider, ThemeProvider} from '@mui/material';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import './index.css';

import {setupStore} from './redux/store';
import {useSessionMutation} from './services/auth';
import {HomeUniteUsTheme} from './theme';
import {ProtectedRoute, ResetPasswordContext} from './features/authentication';
import {Header} from './features/ui';
import {ProfileReview} from './features/intake-profile/ProfileReview';
import {FieldGroupList} from './features/intake-profile/IntakeProfileGroups';
import {
  AppLayout,
  AuthenticatedLayout,
  CoordinatorDashboardLayout,
  GuestDashboardLayout,
} from './features/layouts';
import {
  GuestApplicationTracker,
  Home,
  HostDashboard,
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
  IntakeProfilePortal,
  IntakeProfileSection,
} from './pages';
import {SystemAdminDashboard} from './pages/SystemAdminDashboard';
import {enableMocking} from './utils/testing/browser';
import {useAppDispatch} from './redux/hooks/store';
import {setCredentials} from './redux/authSlice';
import NotFound from './pages/NotFound';

function HuuApp() {
  const [session] = useSessionMutation({
    fixedCacheKey: 'session-post',
  });
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await session().unwrap();
        const {token, user} = res || {};

        if (token && user) {
          dispatch(setCredentials({user, token}));
        } else {
          console.warn('Token or user missing in session response');
        }
      } catch (error) {
        console.error('Failed to fetch session:', error);
      }
    };

    fetchSession();
  }, [dispatch]);

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
        <Route path="/guest">
          <Route
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
          </Route>
          <Route element={<AuthenticatedLayout />}>
            <Route
              path="profile/:profileId"
              element={<IntakeProfilePortal />}
            />
            <Route
              path="profile/:profileId/:sectionId"
              element={<IntakeProfileSection />}
            />
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
              <HostDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="profile/:profileId" element={<IntakeProfile />}>
            <Route path="group/:groupId" element={<FieldGroupList />} />
            <Route path="review" element={<ProfileReview />} />
          </Route>
        </Route>
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <SystemAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
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
