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
// import HostFormAddress from './components/HostFormDetail/HostFormContact' //delete
// import HostFormAddress from './components/HostFormDetail/HostFormAddress' //delete
import HostFormAddress from './components/HostFormDetail/HostFormAddress' //delete
// import HostFormInfo from './components/HostFormDetail/HostFormInfo' //delete
import { GuestRegistration } from './pages/GuestRegistration/GuestRegistration'
import { HostRegistration } from './pages/HostRegistration/HostRegistration'
import ImageUploadComponent from './components/UploadImage/ImageUploadComponent'
import HostFormGender from './components/HostFormDetail/HostFormGender'
import HostFormLang from './components/HostFormDetail/HostFormLang'

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
            {/* testing vvv */}
            <Route path="/hostinfo" component={HostFormGender} />
            <Route path="/hostformaddress" component={HostFormAddress} />
            <Route path="/uploadImage" component={ImageUploadComponent} />
            <Route path="/hostformlang" component={HostFormLang} />
            {/*testing ^^^*/}
            <Route path="/guest/register" component={GuestRegistration} />
            <Route path="/host/register" component={HostRegistration} />
            <FourOhFour />
        </Switch>
    )
}
