import "babel-polyfill"
import * as React from "react"
import {
  BrowserRouter,
  Redirect,
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
import { Register } from "./pages/Register"
import { HostProfilePage } from "./pages/HostProfile"
import { GuestProfilePage } from "./pages/GuestProfile"
import { ProfileEditPage } from "./pages/ProfileEdit"
import { AdminView } from "./pages/AdminView"
import { Demo } from "./pages/Demo"
import { AboutPage } from "./pages/About"
import { HostHomeDataProvider } from "./data/data-context"
import { Guest } from "./models"
import { AppConfig } from "./data/config"
import { useAuth0 } from "./react-auth0-spa"
import { CreateProfile, CreateHostProfile, CreateGuestProfile } from "./pages/CreateProfile"
import { AllHosts } from "./pages/Admin/AllHosts"

export interface AppProps { }

export const LoginView = () => {
  const { loginWithPopup } = useAuth0();

  const onLoginClick: React.EventHandler<React.SyntheticEvent<HTMLAnchorElement>> = async (e: React.SyntheticEvent<HTMLAnchorElement>) => {

    e.preventDefault();

    await loginWithPopup();
  };

  return (
    <AppStyle.AuthHolder>
      <AppStyle.AuthButton href='' onClick={onLoginClick}>Login to Host Homes</AppStyle.AuthButton>
    </AppStyle.AuthHolder>
  );
};

export const App = () => {

  const { isInitializing, isAuthenticated, user } = useAuth0();

  return (
    <React.Fragment>


      {
        isInitializing
          ? <div>Loading...</div>
          : <HostHomeDataProvider>
              <BrowserRouter>
                {isAuthenticated
                  ? <React.Fragment>
                      <AppStyle.FlexHolder>
                        <AppStyle.FlexGrowHolder>
                          <a href="http://www.safeplaceforyouth.org/" target="_blank">
                            <AppStyle.Image src={logo} alt="Logo" />
                          </a>
                        </AppStyle.FlexGrowHolder>
                        <AppStyle.Holder>
                          <NavLink to={`/demo`}>
                            DEMO
                          </NavLink>
                        </AppStyle.Holder>
                        <AppStyle.Holder>
                          <NavLink to={`/about`}>
                            ABOUT
                          </NavLink>
                        </AppStyle.Holder>
                        <AppStyle.Holder>
                          <NavLink to={`/admin/guests`}>
                            ADMIN
                          </NavLink>
                        </AppStyle.Holder>
                        <AppStyle.Holder>
                          <NavLink to={`/admin/hosts`}>
                            ALL HOSTS
                          </NavLink>
                        </AppStyle.Holder>
                        <AppStyle.Holder>
                          <span>Hello, {(user && user.name) || 'User'}</span>
                        </AppStyle.Holder>
                      </AppStyle.FlexHolder>
                      <React.Fragment>
                        <Switch>
                          <Route exact path="/" component={ProfileEditPage} />
                          <Route path="/about" component={AboutPage} />
                          <Route exact path="/register/:org/host" component={ProfileEditPage} />
                          <Route exact path="/register/:org/guest" component={ProfileEditPage} />
                          <Route exact path="/demo" component={Demo} />
                          <Route path="/admin/guests" component={AdminView} />
                          <Route
                            path="/admin/guest/:id"
                            component={AdminGuestView}
                          />
                          <Route
                            path="/guests/:guestId/matches/:hostId"
                            component={HostProfilePage}
                          />
                          <Route
                            path="/guests/:id"
                            component={GuestProfilePage}
                          />
                          <Route
                            path="/edit/:id"
                            component={ProfileEditPage}
                          />
                          <Route
                            path="/admin/hosts"
                            component={AllHosts}
                          />
                          <FourOhFour />
                        </Switch>
                      </React.Fragment>
                    </React.Fragment>
                  : <React.Fragment>
                      <Switch>
                        <Route exact path="/" component={ProfileEditPage} />
                        <Route exact path="/register" component={Register} />
                        <Route exact path="/register/:org/host" component={LoginView} />
                        <Route exact path="/register/:org/guest" component={LoginView} />
                        <Redirect to="/register" />
                      </Switch>
                    </React.Fragment>
                }
              </BrowserRouter>
            </HostHomeDataProvider>
      }
    </React.Fragment>
  );

}
