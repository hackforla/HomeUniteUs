import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {CssBaseline, StyledEngineProvider, ThemeProvider} from '@mui/material';
import {Provider} from 'react-redux';
import {HomeUniteUsTheme} from './theme';
import {
  Home,
  CoordinatorDashboard,
  GuestApplicationTracker,
  Guests,
  GuestProfile,
  HostApplicationTracker,
  SignIn,
  SignUp,
} from './views';
import {store} from './app/store';
import {ProtectedRoute} from './auth/ProtectedRoute';
import {useSessionMutation} from './services/auth';
import {AccountVerification} from './views/AccountVerification';
// import { ApprovalTwoTone } from '@mui/icons-material';

function HuuApp() {
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
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/verification" element={<AccountVerification />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/host" element={<HostApplicationTracker />} />
          <Route path="/guest" element={<Guests />}>
            <Route index element={<GuestProfile />} />
            {/* Route contains a nested Routes component that renders multi step */}
            <Route path="application/*" element={<GuestApplicationTracker />} />
          </Route>
          <Route path="/coordinator" element={<CoordinatorDashboard />} />
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
