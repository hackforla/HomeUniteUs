import "babel-polyfill"
import * as React from "react"
import {
  BrowserRouter,
  Route,
  Switch,
  NavLink,
  useParams,
  useHistory
} from "react-router-dom"
import * as AppStyle from "./AppStyle"
import logo from "./img/masterSpyLogo3.png"
import FourOhFour from "./pages/FourOhFour"
import { AdminGuestView } from "./pages/AdminGuestView"
import { HostProfilePage } from "./pages/HostProfile"
import { GuestProfilePage } from "./pages/GuestProfile"
import { AdminView } from "./pages/AdminView"
import { Demo } from "./pages/Demo"
import { AboutPage } from "./pages/About"
import { HostHomeDataProvider } from "./data/data-context"
import { Guest } from "./models"
import { AppConfig } from "./data/config"
import { useAuth0 } from "./react-auth0-spa"
import { CreateProfile, CreateHostProfile, CreateGuestProfile } from "./pages/CreateProfile"
import {ThemeProvider} from 'styled-components';

export interface AppProps { }

export const LoginView = () => {
  const { loginWithPopup } = useAuth0();

  const onLoginClick: React.EventHandler<React.SyntheticEvent<HTMLAnchorElement>> = async (e: React.SyntheticEvent<HTMLAnchorElement>) => {

    e.preventDefault();

    await loginWithPopup();
  };

  return (
    <AppStyle.AuthHolder>
      <a href='' onClick={onLoginClick}>Login to Host Homes</a>
    </AppStyle.AuthHolder>
  );
};

export const App = () => {

  const { isInitializing, isAuthenticated, user } = useAuth0();

  const theme = { mode: 'dark' }

  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
      {
        isInitializing
          ? <div>Loading...</div>
          : isAuthenticated
            ? <HostHomeDataProvider>
              <BrowserRouter>
                <React.Fragment>
                  <AppStyle.FlexHolder>
                    <AppStyle.FlexGrowHolder>
                      <a href="http://www.safeplaceforyouth.org/" target="_blank">
                        <AppStyle.Image src={logo} alt="Logo" />
                      </a>
                    </AppStyle.FlexGrowHolder>
                    <AppStyle.Holder>
                      <NavLink to={`/hosthome/demo`}>
                        DEMO
                    </NavLink>
                    </AppStyle.Holder>
                    <AppStyle.Holder>
                      <NavLink to={`/hosthome/about`}>
                        ABOUT
                    </NavLink>
                    </AppStyle.Holder>
                    <AppStyle.Holder>
                      <NavLink to={`/hosthome/admin/guests`}>
                        ADMIN
                    </NavLink>
                    </AppStyle.Holder>
                    <AppStyle.Holder>
                      <span>Hello, {(user && user.name) || 'User'}</span>
                    </AppStyle.Holder>
                  </AppStyle.FlexHolder>
                  <React.Fragment>
                    <Switch>
                      <Route exact path="/" component={AboutPage} />
                      <Route exact path="/hosthome" component={AboutPage} />
                      <Route exact path="/hosthome/demo" component={Demo} />
                      <Route path="/hosthome/about" component={AboutPage} />
                      <Route path="/hosthome/admin/guests" component={AdminView} />
                      <Route
                        path="/hosthome/admin/guest/:id"
                        component={AdminGuestView}
                      />
                      <Route
                        path="/hosthome/guests/:guestId/matches/:hostId"
                        component={HostProfilePage}
                      />
                      <Route
                        path="/hosthome/guests/:id"
                        component={GuestProfilePage}
                      />
                      <FourOhFour />
                    </Switch>
                  </React.Fragment>
                </React.Fragment>
              </BrowserRouter>
            </HostHomeDataProvider>
            : <LoginView />
      }
      </React.Fragment>
    </ThemeProvider>
  );

}
