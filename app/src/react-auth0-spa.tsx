import * as React from 'react'
import createAuth0Client from '@auth0/auth0-spa-js'
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client'

export interface Auth0RedirectState {
  targetUrl?: string
}

export interface Auth0User extends Omit<IdToken, '__raw'> {}

interface Auth0Context {
  user?: Auth0User
  isAuthenticated: boolean
  isInitializing: boolean
  isPopupOpen: boolean
  loginWithPopup(o?: PopupLoginOptions): Promise<void>
  handleRedirectCallback(): Promise<RedirectLoginResult>
  getIdTokenClaims(o?: getIdTokenClaimsOptions): Promise<IdToken>
  loginWithRedirect(o?: RedirectLoginOptions): Promise<void>
  getTokenSilently(o?: GetTokenSilentlyOptions): Promise<string | undefined>
  getTokenWithPopup(o?: GetTokenWithPopupOptions): Promise<string | undefined>
  logout(o?: LogoutOptions): void
}
interface Auth0ProviderOptions {
  children: React.ReactElement
  onRedirectCallback(result: RedirectLoginResult): void
}

export const Auth0Context = React.createContext<Auth0Context | null>(null)
export const useAuth0 = () => React.useContext(Auth0Context)!
export const Auth0Provider = ({
  children,
  onRedirectCallback,
  ...initOptions
}: Auth0ProviderOptions & Auth0ClientOptions) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [isInitializing, setIsInitializing] = React.useState(true)
  const [isPopupOpen, setIsPopupOpen] = React.useState(false)
  const [user, setUser] = React.useState<Auth0User>()
  const [auth0Client, setAuth0Client] = React.useState<Auth0Client>()

  React.useEffect(() => {
    console.log(`Auth0Provider::useEffect running`)
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(initOptions)
      setAuth0Client(auth0FromHook)

      if (window.location.search.includes('code=')) {
        let appState: RedirectLoginResult = {}
        try {
          ;({ appState } = await auth0FromHook.handleRedirectCallback())
        } finally {
          onRedirectCallback(appState)
        }
      }

      const authed = await auth0FromHook.isAuthenticated()

      console.log(`authed = ${authed}`)

      if (authed) {
        const userProfile = await auth0FromHook.getUser()

        setIsAuthenticated(true)
        setUser(userProfile)
      }

      setIsInitializing(false)
    }

    console.log(`Auth0Provider::useEffect launching initAuth0`)
    initAuth0()
  }, [])

  const loginWithPopup = async (options?: PopupLoginOptions) => {
    setIsPopupOpen(true)

    try {
      await auth0Client!.loginWithPopup(options)
    } catch (error) {
      console.error(error)
    } finally {
      setIsPopupOpen(false)
    }

    const userProfile = await auth0Client!.getUser()
    setUser(userProfile)
    setIsAuthenticated(true)
  }

  const handleRedirectCallback = async () => {
    setIsInitializing(true)

    const result = await auth0Client!.handleRedirectCallback()
    const userProfile = await auth0Client!.getUser()

    setIsInitializing(false)
    setIsAuthenticated(true)
    setUser(userProfile)

    return result
  }

  const loginWithRedirect = (options?: RedirectLoginOptions) =>
    auth0Client!.loginWithRedirect(options)

  const getTokenSilently = (options?: GetTokenSilentlyOptions) =>
    auth0Client!.getTokenSilently(options)

  const logout = (options?: LogoutOptions) => auth0Client!.logout(options)

  const getIdTokenClaims = (options?: getIdTokenClaimsOptions) =>
    auth0Client!.getIdTokenClaims(options)

  const getTokenWithPopup = (options?: GetTokenWithPopupOptions) =>
    auth0Client!.getTokenWithPopup(options)

  return (
    <Auth0Context.Provider
      value={{
        user,
        isAuthenticated,
        isInitializing,
        isPopupOpen,
        loginWithPopup,
        loginWithRedirect,
        logout,
        getTokenSilently,
        handleRedirectCallback,
        getIdTokenClaims,
        getTokenWithPopup,
      }}
    >
      {children}
    </Auth0Context.Provider>
  )
}
