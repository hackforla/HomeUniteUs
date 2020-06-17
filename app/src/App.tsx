// import 'babel-polyfill'
import * as React from 'react'
import { Route, Switch, NavLink, useParams, useHistory } from 'react-router-dom'
import * as AppStyle from './AppStyle'
import logo from './img/masterSpyLogo3.png'
import Routes from './Routes'
import { HostHomeDataProvider } from './data/data-context'
import { Guest } from './models'
import { AppConfig } from './data/config'
import { useAuth0 } from './react-auth0-spa'
import { ApiWrapper } from './data/ApiWrapper'
import { Host } from './models/Host'
import { Accounts } from './models/Accounts'
import { Header } from './components/Header/Header'

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
    const { isInitializing, isAuthenticated, user, logout } = useAuth0()

    return (
        <React.Fragment>
            {isInitializing ? (
                <div>Loading...</div>
            ) : isAuthenticated 
            ? ( 
                    <HostHomeDataProvider>
                        <React.Fragment>
                            <Header />
                            <React.Fragment>
                                <Routes />
                            </React.Fragment>
                        </React.Fragment>
                    </HostHomeDataProvider>
            ) : (
            <LoginView />
            )}
        </React.Fragment>
    )
}
