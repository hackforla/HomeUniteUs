import * as React from "react"
import { makeStyles, Typography } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
  modal: {
    width: "100vw",
    height: "100vh",
    backgroundColor: "#000000b1",
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
    color: "white",
    fontSize: "2em"
  },
  x: {
    color: "black",
    fontSize: "2em",
    height: "1.5em",
    width: "1.5em",
    borderRadius: "50%",
    backgroundColor: "white",
    textAlign: "center",
    transform: "scale(.8,.8)",
    cursor: "default"
  },
  textHolder: {
    display: "flex",
    justifyContent: "space-between"
  },
  images: {
    border: "1px solid #757575"
  }
}))

const Modal = (props: any) => {
  const styles = useStyles()
  const visible = props.visible

  const closePic = () =>
    props.showElement({
      adminPage: false,
      guestMatches: false,
      interestButtons: false,
      annotationOfInterested: false,
      annotationOfDecline: false
    })

  const modals = Object.values(visible).some(value => value) ? (
    <section
      className={styles.modal}
      // onClick={() =>
      //   props.showElement({
      //     adminPage: false,
      //     guestMatches: false,
      //     interestButtons: false,
      //     annotationOfInterested: false,
      //     annotationOfDecline: false
      //   })
      // }
    >
      {
      // visible.adminPage ? (
        props.selectedImage === 'adminPage' ? (
        <div>
          <div className={styles.textHolder}>
            <Typography className={styles.text}>Admin Page</Typography>
            <Typography className={styles.x} onClick={() => closePic()}>
              X
            </Typography>
          </div>
          <img
            className={styles.images}
            title="adminPage"
            src={"/hosthome/img/adminPage.png"}
            alt={"Admin Page"}
          />
        </div>
      ) : null}
      {
      // visible.guestMatches ? (
        props.selectedImage === 'guestMatches' ? (
        <div>
          <div className={styles.textHolder}>
            <Typography className={styles.text}>Guest Matches</Typography>
            <Typography className={styles.x} onClick={() => closePic()}>
              X
            </Typography>
          </div>
          <img
            className={styles.images}
            title="guestMatches"
            src={"/hosthome/img/guestMatches.png"}
            alt={"Guest Matches"}
          />
        </div>
      ) : null}
      {
      // visible.interestButtons ? (
        props.selectedImage === 'interestButtons' ? (
        <div>
          <div className={styles.textHolder}>
            <Typography className={styles.text}>Interest Buttons</Typography>
            <Typography className={styles.x} onClick={() => closePic()}>
              X
            </Typography>
          </div>
          <img
            className={styles.images}
            title="interestButtons"
            src={"/hosthome/img/interestButtons.png"}
            alt={"Interest Buttons"}
          />
        </div>
      ) : null}
      {
      // visible.annotationOfInterested ? (
        props.selectedImage === 'annotationOfInterested' ? (
        <div>
          <div className={styles.textHolder}>
            <Typography className={styles.text}>
              Annotation of Interested
            </Typography>
            <Typography className={styles.x} onClick={() => closePic()}>
              X
            </Typography>
          </div>
          <img
            className={styles.images}
            title="annotationOfInterested"
            src={"/hosthome/img/annotationOfInterested.png"}
            alt={"Annotation of Interested"}
          />
        </div>
      ) : null}
      {
      // visible.annotationOfDecline ? (
        props.selectedImage === 'annotationOfDecline' ? (
        <div>
          <div className={styles.textHolder}>
            <Typography className={styles.text}>
              Annotation of Decline
            </Typography>
            <Typography className={styles.x} onClick={() => closePic()}>
              X
            </Typography>
          </div>
          <img
            className={styles.images}
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
