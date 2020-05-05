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

const questions = [
  {
    id: '1',
    question: 'How would you describe your home?',
    type: 'radio',
    options: [
      {label: 'Owned Single-Unit', value: 'single'}, 
      {label: 'Owned Multi-Unit', value: 'multi'},
      {label: 'Owned House', value: 'house'}
    ]
  },
  {
    id: '2',
    question: 'Do you allow drinking there?',
    type: 'radio',
    options: [
      {label: 'Yes', value: 'yes'}, 
      {label: 'We don\'t drink, but it is allowed', value: 'we-dont'}, 
      {label: 'No', value: 'no'}
    ],
  },
  {
    id: '3',
    question: 'Do you allow smoking at your residence?',
    type: 'radio',
    options: [
      {label: 'Yes, we smoke inside', value: 'inside'},
      {label: 'Yes, but only outside', value: 'outside'},
      {label: 'No', value: 'no'}
    ]
  },
  {
    id: '4',
    question: 'Do you allow substance use at your residence?',
    type: 'radio',
    options: [
      {label: 'Yes', value: 'yes'},
      {label: 'No', value: 'no'},
    ]
  },
  {
    id: '5',
    question: 'What are your interests?',
    type: 'checkbox',
    options: [
      {label: 'Tinkering', value: 'tinkering'},
      {label: 'Trashy TV', value: 'tv'},
      {label: 'Puzzles', value: 'puzzles'},
      {label: 'Cheesecakes', value: 'cheesecakes'}
    ]
  },
  {
    id: '6',
    question: 'Tell us about yourself',
    type: 'textarea'
  }
];

const answers = [
  {id: '1', value: 'house'},
  {id: '2', value: ''},
  {id: '3', value: 'outside'},
  {id: '4', value: 'no'},
  {id: '5', value: ['cheesecakes', 'tv']},
  {id: '6', value: 'my name is philbert rosenthal'}
];

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
                        <Route exact path="/" render={(props) => <ProfileEditPage questions={questions} answers={answers} />} />
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
