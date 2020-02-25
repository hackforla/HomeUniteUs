import * as React from "react"
import { makeStyles } from "@material-ui/core/styles"
import HostCard from "./HostCard"
import LocationCard from "./LocationCard"
import { Host } from "../../models/Host"
import { Grid, Typography } from "@material-ui/core"
import { HostHomeType } from "../../models/HostHomeType"

const useStyles = makeStyles(() => ({
  generalInfoRow: {
    display: "flex",
    justifyContent: "space-around"
  },
  headerText: { fontSize: "24px", fontWeight: "bold", margin: "0 0 30px 25px" },
  paragraph: { fontSize: "20px", margin: "0 0 30px 25px" },
}))

interface IGeneralInfoProps {
  host: Host
}


const hostTypeToString = (hostHomeType: HostHomeType) => hostHomeType === HostHomeType.Respite
  ? 'respite'
  : hostHomeType === HostHomeType.Full
    ? 'full-time'
    : 'full-time or respite';

export const GeneralInfo = ({ host }: IGeneralInfoProps) => {
  const classes = useStyles()

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <p className={classes.headerText}>Meet {host.firstName}</p>
          <span className={classes.paragraph}>{`${host.firstName} ${host.lastName} is the ${hostTypeToString(host.type)} host of a ${host.housingType.toLowerCase()} in ${host.address}`}</span>
        </Grid>
      </Grid>
      <div className={classes.generalInfoRow}>
        <HostCard host={host} />
        <LocationCard host={host} />
      </div>
    </>
  )
}

export default GeneralInfo
