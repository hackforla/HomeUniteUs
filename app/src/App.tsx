import 'babel-polyfill'
import * as React from 'react'
import {
    BrowserRouter,
    Route,
    Switch,
    NavLink,
    useParams,
    useHistory,
} from 'react-router-dom'
import * as AppStyle from './AppStyle'
import logo from './img/masterSpyLogo3.png'
import FourOhFour from './pages/FourOhFour'
import { AdminGuestView } from './pages/AdminGuestView'
import { HostProfilePage } from './pages/HostProfile'
import { GuestProfilePage } from './pages/GuestProfile'
import { AdminView } from './pages/AdminView'
import { Demo } from './pages/Demo'
import { AboutPage } from './pages/About'
import { HostHomeDataProvider } from './data/data-context'
import { Guest } from './models'
import { AppConfig } from './data/config'
import { useAuth0 } from './react-auth0-spa'
import {
    CreateProfile,
    CreateHostProfile,
    CreateGuestProfile,
} from './pages/CreateProfile'
import { AllHosts } from './pages/Admin/AllHosts'
import ProfileSelection from './pages/ProfileSelection/ProfileSelection'
import HostQuestions from './pages/HostQuestions'
import GuestQuestions from './pages/GuestQuestions/GuestQuestions'

export interface AppProps {}

export const LoginView = () => {
    const { loginWithPopup } = useAuth0()

    const onLoginClick: React.EventHandler<React.SyntheticEvent<
        HTMLAnchorElement
    >> = async (e: React.SyntheticEvent<HTMLAnchorElement>) => {
        e.preventDefault()

        await loginWithPopup()
    }

    return (
        <AppStyle.AuthHolder>
            <AppStyle.AuthButton href="" onClick={onLoginClick}>
                Login to Host Homes
            </AppStyle.AuthButton>
        </AppStyle.AuthHolder>
    )
}

export const App = () => {
  const history = useHistory()

  const logoutClick = () => {
    logout()
    history.push('/') //route not working but you get signed out
  }

  const { isInitializing, isAuthenticated, user, logout } = useAuth0();

  return (
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
                      <p onClick={logoutClick}>
                        Logout
                    </p>
                    </AppStyle.Holder>
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
                      <Route exact path="/" component={AboutPage} />
                      <Route exact path="/demo" component={Demo} />
                      <Route path="/about" component={AboutPage} />
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
                        path="/admin/hosts"
                        component={AllHosts}
                      />
                      <Route
                        exact path="/profileselection/:id"
                        component={ProfileSelection}
                      />
                      <Route
                        exact path="/host/:id"
                        component={HostQuestions}
                      />
                      <Route
                        exact path="/guest/:id"
                        component={GuestQuestions}
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
  );
}
