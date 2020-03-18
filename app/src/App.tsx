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
import { Button } from "@material-ui/core"
import { AdminGuestView } from "./pages/AdminGuestView"
import { HostProfilePage } from "./pages/HostProfile"
import { GuestProfilePage } from "./pages/GuestProfile"
import { AdminView } from "./pages/AdminView"
import { Demo } from "./pages/Demo"
import { AboutPage } from "./pages/About"
import { HostHomeDataProvider } from "./data/data-context"
import { Guest } from "./models"
import { AppConfig } from "./data/config"

export interface AppProps {}

export const PlaceholderView = () => (
  <AppStyle.ToolBarTitle>Nothing here yet</AppStyle.ToolBarTitle>
)

export const PlaceholderWithIdView = () => {
  const { id } = useParams()
  return (
    <AppStyle.ToolBarTitle>Nothing here yet for ID: {id}</AppStyle.ToolBarTitle>
  )
}

export const WelcomeView = () => {
  const history = useHistory()
  return (
    <React.Fragment>
      <AppStyle.ToolBarTitle>About</AppStyle.ToolBarTitle>
    </React.Fragment>
  )
}
export const App = () => {
  let a: JSX.Element

  return (
    <React.Fragment>
      <HostHomeDataProvider>
        <BrowserRouter>
          <React.Fragment>
            <AppStyle.FlexHolder>
              <AppStyle.FlexGrowHolder>
                <a href="http://www.safeplaceforyouth.org/" target="_blank">
                  <AppStyle.Image src={logo} alt="Logo" />
                </a>
              </AppStyle.FlexGrowHolder>
              <AppStyle.Holder>
                <Button component={NavLink} to={`/hosthome/demo`}>
                  DEMO
                </Button>
              </AppStyle.Holder>
              <AppStyle.Holder>
                <Button component={NavLink} to={`/hosthome/about`}>
                  ABOUT
                </Button>
              </AppStyle.Holder>
              <AppStyle.Holder>
                <Button component={NavLink} to={`/hosthome/admin/guests`}>
                  ADMIN
                </Button>
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
              </Switch>
            </React.Fragment>
          </React.Fragment>
        </BrowserRouter>
      </HostHomeDataProvider>
    </React.Fragment>
  )
}
