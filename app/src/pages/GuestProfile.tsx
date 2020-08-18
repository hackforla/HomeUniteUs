import * as React from 'react'
import { Profile } from '../components/GuestProfile/Profile'
import { useLocation } from 'react-router'

export const GuestProfilePage = () => {
  const location = useLocation()

  React.useEffect(() => {
    try {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'auto',
      })
    } catch (error) {
      window.scrollTo(0, 0)
    }
  }, [location.pathname, location.search])

  return (
    <React.Fragment>
      <Profile />
    </React.Fragment>
  )
}

export default GuestProfilePage
