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
  }
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
        <Typography variant='h4'>{`${host.firstName} ${host.lastName}, ${hostTypeToString(host.type)} host, ${host.housingType  }`}</Typography>
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
