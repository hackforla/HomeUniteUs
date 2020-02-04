import * as React from "react"
import { Profile } from "../components/HostProfile/Profile"
import { useLocation } from "react-router"

export const HostProfilePage = () => {
  const location = useLocation()

  React.useEffect(() => {
    try {
      window.scroll({
        top: 0,
        left: 0,
        behavior: "auto"
      })
    } catch (error) {
      window.scrollTo(0, 0)
    }
  }, [location.pathname, location.search])

  return (
    <div>
      <Profile />
    </div>
  )
}

export default HostProfilePage
