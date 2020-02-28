import * as React from "react"
import { makeStyles } from "@material-ui/core/styles"
import AppBar from "@material-ui/core/AppBar"
import Button from "@material-ui/core/Button"
import { useParams, useHistory } from "react-router"
import { useHostHomeData } from "../../data/data-context"
import { ProgressPlugin } from "webpack"
import { Host, MatchResult } from "../../models"

const useStyles = makeStyles(theme => ({
  appBar: {
    top: "auto",
    bottom: 0,
    height: "100px",
    display: "flex",
    justifyContent: "space-evenly",
    flexDirection: "column",
    alignItems: "flex-start"
  },
  buttons: {
    margin: "0 100px 0 35px"
  },
  yesButton: {
    marginLeft: "20px",
    backgroundColor: "#00AAEF",
    margin: "0 25px 0 0"
  },
  extraSpace: {
    height: "50px"
  }
}))

export const ButtonBar = () => {
  const classes = useStyles()
  const history = useHistory()
  let { guestId, hostId } = useParams()

  const gid = Number.parseInt(guestId || "")
  const hid = Number.parseInt(hostId || "")

  const { data, markAsInterested, markAsNotInterested } = useHostHomeData()

  return (
    <React.Fragment>
      <AppBar position="fixed" color="inherit" className={classes.appBar}>
        <div style={{ margin: "0 0 0 50px", fontWeight: 700, fontSize: "20px" }}>
          Would you like to express interest in this host's home?
        </div>
        <div className={classes.buttons}>
          <Button
            variant="contained"
            color="primary"
            className={classes.yesButton}
            onClick={() => {
              markAsInterested({
                guestId: gid,
                hostId: hid
              })

              history.push(`/hosthome/admin/guest/${guestId}`)
            }}
          >
            I'm interested
          </Button>
          <Button
            variant="contained"
            // color="secondary"
            onClick={() => {
              markAsNotInterested({
                guestId: gid,
                hostId: hid
              })

              history.push(`/hosthome/admin/guest/${guestId}`)
            }}
            style={{ backgroundColor: "white" }}
          >
            I'm not interested
          </Button>
        </div>
      </AppBar>

      <div className={classes.extraSpace}></div>
    </React.Fragment>
  )
}

export default ButtonBar
