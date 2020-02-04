import * as React from "react"
import { makeStyles } from "@material-ui/core/styles"
import HostCard from "./HostCard"
import LocationCard from "./LocationCard"
import { Host } from "../../models/Host"

const useStyles = makeStyles(() => ({
  generalInfoRow: {
    display: "flex",
    justifyContent: "space-around"
  }
}))

interface IGeneralInfoProps {
  host: Host
}

export const GeneralInfo = ({ host }: IGeneralInfoProps) => {
  const classes = useStyles()

  return (
    <div className={classes.generalInfoRow}>
      <HostCard host={host} />
      <LocationCard host={host} />
    </div>
  )
}

export default GeneralInfo
