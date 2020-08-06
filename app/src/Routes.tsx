import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { AdminGuestView } from './pages/AdminGuestView'
import { HostProfilePage } from './pages/HostProfile'
import { GuestProfilePage } from './pages/GuestProfile'
import { ProfileEditPage } from './pages/ProfileEdit'
import { AdminView } from './pages/AdminView'
import { Demo } from './pages/Demo'
import { AboutPage } from './pages/About'
import {
    CreateProfile,
    CreateHostProfile,
    CreateGuestProfile,
} from './pages/CreateProfile'
import { AllHosts } from './pages/Admin/AllHosts'
import ProfileSelection from './pages/ProfileSelection/ProfileSelection'
import FourOhFour from './pages/FourOhFour'
import HostFormAddress from './components/HostFormDetail/HostFormContact'

export default function Routes() {
    return (
        <Switch>
            <Route exact path="/" component={AboutPage} />
            <Route exact path="/demo" component={Demo} />
            <Route path="/about" component={AboutPage} />
            <Route path="/profile" component={ProfileEditPage} />
            <Route path="/admin/guests" component={AdminView} />
            <Route path="/admin/guest/:id" component={AdminGuestView} />
            <Route
                path="/guests/:guestId/matches/:hostId"
                component={HostProfilePage}
            />
            <Route path="/guests/:id" component={GuestProfilePage} />
            <Route path="/admin/hosts" component={AllHosts} />
            <Route
                exact
                path="/profileselection"
                component={ProfileSelection}
            />
            <Route path="/hostformaddress" component={HostFormAddress} />{' '}
            {/*testing ^^^*/}
            <FourOhFour />
        </Switch>
    )
}
