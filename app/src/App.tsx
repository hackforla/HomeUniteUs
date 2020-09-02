// import 'babel-polyfill'
import * as React from 'react'
import { Route, Switch, NavLink, useParams, useHistory } from 'react-router-dom'
import * as AppStyle from './AppStyle'
import Routes from './Routes'
import { HostHomeDataProvider } from './data/data-context'
import { Guest } from './models'
import { AppConfig } from './data/config'
import { useAuth0, Auth0User } from './react-auth0-spa'
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
                Login to Home Unite Us
            </AppStyle.AuthButton>
        </AppStyle.AuthHolder>
    )
}

interface AccountTypeResponse {
    type: string
}

export const App = () => {
    const history = useHistory()
    const { isInitializing, isAuthenticated, user, logout } = useAuth0()

    React.useEffect(() => {
        console.log(`App: user just changed to ${JSON.stringify(user)}`)
        if (user) {
            fetch('/api/account/type', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: (user as Auth0User).email,
                }),
            })
                .then((response: Response) => {
                    if (response.status !== 200) {
                        throw new Error(
                            `Error checking for account: ${response.statusText}`
                        )
                    } else {
                        return response.json()
                    }
                })
                .then((accountInfo: AccountTypeResponse) => {
                    console.log(`accountInfo: ${JSON.stringify(accountInfo)}`)
                    switch (accountInfo.type) {
                        case 'host':
                            //TODO: fetch host registration status and route
                            break
                        case 'guest':
                            //TODO: fetch guest registration status and route
                            break
                        case 'none':
                            history.push('/profileselection')
                            break
                        default:
                            throw new Error(
                                `Bad account type response: ${JSON.stringify(
                                    accountInfo
                                )}`
                            )
                    }
                })
        }
    }, [user])

    return (
        <React.Fragment>
            {isInitializing ? (
                <div>Loading...</div>
            ) : isAuthenticated ? (
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
