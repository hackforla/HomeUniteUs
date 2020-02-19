import * as React from "react"
import { Guest } from "../../models/Guest"
import { makeStyles } from "@material-ui/core/styles"
import GuestCard from "./GuestCard"
import GuestInfo from "./GuestInfo"
import { Grid, Typography } from "@material-ui/core"
import { HostHomeType } from "../../models/HostHomeType"

const useStyles = makeStyles(() => ({
  generalInfoRow: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center"
  },
  header: {
    fontSize: "24px"
  },
  additionalInfo: {
    width: "70%",
    margin: "0 0 3em 1.6em",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly"
  }
}))

interface Props {
  guest: Guest
}

const guestTypeToString = (hostHomeType: HostHomeType) => hostHomeType === HostHomeType.Respite
  ? 'respite'
  : hostHomeType === HostHomeType.Full
  ? 'full-time'
  : 'full-time or respite';

const GeneralInfo = ({ guest }: Props) => {
  const style = useStyles()

  return (
    <div>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant='h4'>{`${guest.firstName} ${guest.lastName}, guest seeking ${guestTypeToString(guest.type)} host`}</Typography>
        </Grid>
      </Grid>
      <div className={style.generalInfoRow}>
        <GuestCard guest={guest} />
        <GuestInfo guest={guest} />
      </div>
      <div className={style.additionalInfo}>
        <p className={style.header}>Additional Info</p>
        <br />

        <p>Intro:</p>
        <p>{guest.guestIntro}</p>
        <br />

        <p>Stay Statement:</p>
        <p>{guest.guestStayStatement}</p>
        <br />

        <p>Employment:</p>
        <p>{guest.employmentInfo}</p>
        <br />

        <p>Challenges:</p>
        <p>{guest.guestChallenges}</p>
        <br />

        {/* <p>Date of Birth:</p>
                <p>{guest.dateOfBirth.getFullYear()}</p>
                <br /> */}

        {/* <p>Email:</p>
                <p>{guest.email}</p> */}
      </div>
    </div>
  )
}

export default GeneralInfo
