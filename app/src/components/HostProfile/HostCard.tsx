import * as React from "react"
import { makeStyles } from "@material-ui/core/styles"
import HostRoomates from "./HostRoomates"
import { Host } from "../../models/Host"

const useStyles = makeStyles(() => ({
  hostCardContainer: {
    border: "1px hidden purple",
    height: "600px",
    padding: "10px 20px",
    flexGrow: 1,

    display: "flex",
    flexWrap: "wrap"
  },
  hostImageContainer: {
    border: "1px hidden pink",
    width: "100%",
    height: "400px",

    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  },
  hostImage: {},
  hostDescriptionContainer: {
    border: "1px hidden blue",
    height: "175px",
    width: "100%"
  }
}))

interface IHostCardProps {
  host: Host
}

export const HostCard = ({ host }: IHostCardProps) => {
  const classes = useStyles()

  return (
    <div className={classes.hostCardContainer}>
      <div className={classes.hostImageContainer}>
        <img
          className={classes.hostImage}
          src="https://www.fillmurray.com/400/400"
          alt="avatar"
        />
      </div>

      <div className={classes.hostDescriptionContainer}>
        <HostRoomates roomates={host.householdMembers} />
      </div>
    </div>
  )
}

export default HostCard
