import * as React from "react"
import { Guest } from "../../models/Guest"
import { makeStyles } from "@material-ui/core/styles"
import GuestCard from "./GuestCard"
import GuestInfo from "./GuestInfo"
import { Grid, Typography } from "@material-ui/core"
import { HostHomeType } from "../../models/HostHomeType"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPrescriptionBottleAlt, faPaw, faSmokingBan, faWineBottle } from "@fortawesome/free-solid-svg-icons"

const useStyles = makeStyles(() => ({
  generalInfoRow: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center"
  },
  icon: {},
  header: {
    fontSize: "24px"
  },
  additionalInfo: {
    width: "70%",
    margin: "0 0 3em 1.6em",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly"
  },
  spacer: {
    height: "19%"
  },
  text: {
    fontSize: "1.4rem"
  },
  policy: {
    border: "1px hidden blue",
    // width: "30%",
    margin: "20px 0",
    display: "flex",
    textAlign: 'center',
    flexDirection: "column",
    alignItems: "center"
  },
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
      <div>

        <Grid container alignContent='center' alignItems='center'>
          <Grid item xs alignContent='center' alignItems='center'>
            <div className={style.policy}>
              <FontAwesomeIcon aria-hidden="true"
                size="7x" icon={faSmokingBan} className={style.icon} />
              <span className={style.text}>{guest.smokingText}</span>
            </div>
          </Grid>
          <Grid item xs alignContent='center' alignItems='center'>
            <div className={style.policy}>
              <FontAwesomeIcon aria-hidden="true"
                size="7x" icon={faPaw} className={style.icon} />
              <span className={style.text}>{guest.petsText}</span>
            </div>
          </Grid>
        </Grid>

        <Grid container alignContent='center' alignItems='center'>
          <Grid item xs alignContent='center' alignItems='center'>
            <div className={style.policy}>
              <FontAwesomeIcon aria-hidden="true"
                size="7x" icon={faPrescriptionBottleAlt} className={style.icon} />
              <span className={style.text}>{guest.substancesText}</span>
            </div>
          </Grid>
          <Grid item xs alignContent='center' alignItems='center'>
            <div className={style.policy}>
              <FontAwesomeIcon aria-hidden="true"
                size="7x" icon={faWineBottle} className={style.icon} />
              <span className={style.text}>{guest.drinkingText}</span>
            </div>
          </Grid>

        </Grid>
      </div>
      <div className={style.additionalInfo}>
        <h5 className={style.header}>Additional Info</h5>
        <br />

        <b>Intro:</b>
        <p>{guest.guestIntro}</p>
        <br />

        <b>Stay Statement:</b>
        <p>{guest.guestStayStatement}</p>
        <br />

        <b>Employment:</b>
        <p>{`I'm currently employed at ${guest.employmentCompany} as ${guest.employmentPosition}`}</p>
        <br />

        <b>Challenges:</b>
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
