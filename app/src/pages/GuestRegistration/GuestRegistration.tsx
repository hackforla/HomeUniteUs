import * as React from 'react'
import { useAuth0, Auth0User } from '../../react-auth0-spa'

export const GuestRegistration = () => {
  const { user } = useAuth0()
  return (
    <div>
      <h1>Guest Registration for user: {(user as Auth0User).email}</h1>
    </div>
  )
}
