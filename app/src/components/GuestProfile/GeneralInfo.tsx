import * as React from "react"
import { Guest } from "../../models/Guest"
import { makeStyles } from "@material-ui/core/styles"
import GuestCard from "./GuestCard"
import GuestInfo from "./GuestInfo"
import { Grid, Typography } from "@material-ui/core"
import { HostHomeType } from "../../models/HostHomeType"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPrescriptionBottleAlt, faPaw, faSmokingBan, faWineBottle } from "@fortawesome/free-solid-svg-icons"
import GuestPolicies from './GuestPolicies'

const useStyles = makeStyles(() => ({
  generalInfoRow: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center"
  },
  icon: {},
  header: {
    fontSize: "24px", fontWeight: "bold"
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
  paragraph: { fontSize: "20px" },
  headerText: { fontSize: "24px" }
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
          <span className={style.header}>{`${guest.firstName} ${guest.lastName}, guest seeking ${guestTypeToString(guest.type)} host`}</span>
        </Grid>
      </Grid>
      <div className={style.generalInfoRow}>
        <GuestCard guest={guest} />
        <GuestInfo guest={guest} />
      </div>
      <div>
        {/* 
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

        </Grid> */}
        <GuestPolicies guest={guest} />
      </div>
      <div className={style.additionalInfo}>
        <h5 className={style.header}>About the Guest</h5>
        <br />

        <b className={style.headerText}>Intro:</b>
        <p className={style.paragraph}>{guest.guestIntro}</p>
        <br />

        <b className={style.headerText}>Stay Statement:</b>
        <p className={style.paragraph}>{guest.guestStayStatement}</p>
        <br />

        <b className={style.headerText}>Employment:</b>
        <p className={style.paragraph}>{`I'm currently employed at ${guest.employmentCompany} as ${guest.employmentPosition}`}</p>
        <br />

        <b className={style.headerText}>Challenges:</b>
        <p className={style.paragraph}>{guest.guestChallenges}</p>
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
