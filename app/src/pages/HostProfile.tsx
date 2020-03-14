import * as React from "react"
import { Profile } from "../components/HostProfile/Profile"
import { useLocation, useParams, useHistory } from "react-router"
import { MatchResult } from "../models"
import { useHostHomeData } from "../data/data-context"

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
  }, [location.pathname, location.search]);

  const history = useHistory();

  let { guestId, hostId } = useParams();

  const gid = Number.parseInt(guestId || '');
  const hid = Number.parseInt(hostId || '');

  if (!guestId || !hostId) {
    history.push('/hosthome');
  }

  const { data } = useHostHomeData();

  const isUnmatched = data.matchResults.filter((matchResult: MatchResult) => (
    matchResult.guestId === gid
    && matchResult.hostId === hid
    && matchResult.restrictionsFailed.length > 0
  )).length > 0;


  return (
    <React.Fragment>
      <Profile isUnmatched={isUnmatched} />
    </React.Fragment>
  )
}

export default HostProfilePage
