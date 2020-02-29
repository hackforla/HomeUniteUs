import * as React from "react"
import { makeStyles, Typography } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
  modal: {
    width: "100vw",
    height: "100vh",
    backgroundColor: "#ffffffb1",
    backdropFilter: "blur(3px)",
    position: "fixed",
    right: 0,
    top: 0,
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    color: "#757575",
    fontSize: "2em"
  }
}))

const Modal = props => {
  const styles = useStyles()
  const visible = props.visible

  const modals = Object.values(visible).some(value => value) ? (
    <section
      className={styles.modal}
      onClick={() =>
        props.showElement({
          adminPage: false,
          guestMatches: false,
          interestButtons: false,
          annotationOfInterested: false,
          annotationOfDecline: false
        })
      }
    >
      {visible.adminPage ? (
        <div>
          <Typography component="h1" align="left" className={styles.text}>
            Admin Page
          </Typography>
          <img
            title="adminPage"
            src={"/hosthome/img/adminPage.png"}
            alt={"Admin Page"}
          />
        </div>
      ) : null}
      {visible.guestMatches ? (
        <div>
          <Typography component="h1" align="left" className={styles.text}>
            Guest Matches
          </Typography>
          <img
            title="guestMatches"
            src={"/hosthome/img/guestMatches.png"}
            alt={"Guest Matches"}
          />
        </div>
      ) : null}
      {visible.interestButtons ? (
        <div>
          <Typography component="h1" align="left" className={styles.text}>
            Interest Buttons
          </Typography>

          <img
            title="interestButtons"
            src={"/hosthome/img/interestButtons.png"}
            alt={"Interest Buttons"}
          />
        </div>
      ) : null}
      {visible.annotationOfInterested ? (
        <div>
          <Typography component="h1" align="left" className={styles.text}>
            Annotation of Interested
          </Typography>
          <img
            title="annotationOfInterested"
            src={"/hosthome/img/annotationOfInterested.png"}
            alt={"Annotation of Interested"}
          />
        </div>
      ) : null}
      {visible.annotationOfDecline ? (
        <div>
          <Typography component="h1" align="left" className={styles.text}>
            Annotation of Decline
          </Typography>
          <img
            title="annotationOfDecline"
            src={"/hosthome/img/annotationOfDecline.png"}
            alt={"Annotation of Decline"}
          />
        </div>
      ) : null}
    </section>
  ) : (
    <div />
  )
  return <div>{modals}</div>
}

export default Modal
