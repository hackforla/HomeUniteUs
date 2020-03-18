import * as React from "react"
import Modal from "./Modals"
import { useHistory } from "react-router"
import { DemoStyle } from "./style"

import {
  Paper,
  Typography,
  makeStyles,
  Grid,
  Button,
  Link
} from "@material-ui/core"

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3),
    textAlign: "center",
    color: theme.palette.text.secondary,
    border: "1px solid #ADADAD"
  }
}))

export const Demo = () => {
  const [selectedImage, setSelectedImage] = React.useState("none")

  const [visible, showElement] = React.useState({
    adminPage: false,
    guestMatches: false,
    interestButtons: false,
    annotationOfInterested: false,
    annotationOfDecline: false
  })

  const showPic = (e: any) => {
    showElement({ ...visible, [e.target.title]: true })
  }

  const history = useHistory()
  const classes = useStyles()
  return (
    <DemoStyle.MainHolder>
      <Modal
        visible={visible}
        showElement={showElement}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />
      <DemoStyle.DemoHeader>
        <Typography component="h1" align="center" style={{ fontSize: "2em" }}>
          Host Profiles
        </Typography>
      </DemoStyle.DemoHeader>
      <Grid item xs={12} style={{ margin: "30px 0 0 0" }}>
        <DemoStyle.DemoHolder>
          <Paper className={classes.paper}>
            <Grid container>
              <Grid item xs={12} style={{ marginBottom: "8px" }}>
                <Grid container>
                  <Grid item xs={2}>
                    <Typography
                      component="h3"
                      style={{ fontWeight: "bold", textDecoration: "und" }}
                      align="left"
                    >
                      Name
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography
                      component="h3"
                      style={{ fontWeight: "bold" }}
                    ></Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography component="h3" style={{ fontWeight: "bold" }}>
                      Link
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} style={{ paddingBottom: "4px" }}>
                <Grid container>
                  <Grid item xs={2}>
                    <Typography component="p" align="left">
                      <Link
                        style={{
                          color: "rgba(0, 0, 0, 0.54)",
                          textDecoration: "none"
                        }}
                      >
                        Bonnie Wolfe
                      </Link>
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography component="h3"></Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      color="primary"
                      // variant="contained"
                      component={Link}
                      style={{ color: "white", backgroundColor: "#00AAEF" }}
                      // to={"/hosthome/guests/999/matches/999"}
                      onClick={() =>
                        history.push(`/hosthome/guests/999/matches/999`)
                      }
                    >
                      Profile
                    </Button>
                  </Grid>
                </Grid>
                <Grid container style={{ margin: "22px 0 0 0" }}>
                  <Grid item xs={2}>
                    <Typography component="p" align="left">
                      <Link
                        style={{
                          color: "rgba(0, 0, 0, 0.54)",
                          textDecoration: "none"
                        }}
                      >
                        Michael Romanov
                      </Link>
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography component="h3"></Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      color="primary"
                      // variant="contained"
                      component={Link}
                      style={{ color: "white", backgroundColor: "#00AAEF" }}
                      // to={"placeholder"}
                      onClick={() =>
                        history.push(`/hosthome/guests/13/matches/998`)
                      }
                    >
                      Profile
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </DemoStyle.DemoHolder>
      </Grid>
      <DemoStyle.SpacedHeader>
        <Typography component="h1" align="center" style={{ fontSize: "2em" }}>
          Guest Profiles
        </Typography>
      </DemoStyle.SpacedHeader>
      <Grid item xs={12} style={{ margin: "30px 0 0 0" }}>
        <DemoStyle.DemoHolder>
          <Paper className={classes.paper}>
            <Grid container>
              <Grid item xs={12} style={{ marginBottom: "8px" }}>
                <Grid container>
                  <Grid item xs={2}>
                    <Typography
                      component="h3"
                      style={{ fontWeight: "bold", textDecoration: "und" }}
                      align="left"
                    >
                      Name
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography
                      component="h3"
                      style={{ fontWeight: "bold" }}
                    ></Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography component="h3" style={{ fontWeight: "bold" }}>
                      Link
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} style={{ paddingBottom: "4px" }}>
                <Grid container>
                  <Grid item xs={2}>
                    <Typography component="p" align="left">
                      <Link
                        style={{
                          color: "rgba(0, 0, 0, 0.54)",
                          textDecoration: "none"
                        }}
                      >
                        Kirk Chu
                      </Link>
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography component="h3"></Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      color="primary"
                      // variant="contained"
                      component={Link}
                      style={{ color: "white", backgroundColor: "#00AAEF" }}
                      // to={"/hosthome/guests/999"}
                      onClick={() => history.push(`/hosthome/guests/999`)}
                    >
                      Profile
                    </Button>
                  </Grid>
                </Grid>
                <Grid container style={{ margin: "22px 0 0 0" }}>
                  <Grid item xs={2}>
                    <Typography component="p" align="left">
                      <Link
                        style={{
                          color: "rgba(0, 0, 0, 0.54)",
                          textDecoration: "none"
                        }}
                      >
                        Megan Sukarnoputri
                      </Link>
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography component="h3"></Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      color="primary"
                      // variant="contained"
                      component={Link}
                      style={{ color: "white", backgroundColor: "#00AAEF" }}
                      // to={"placeholder"}
                      onClick={() => history.push(`/hosthome/guests/998`)}
                    >
                      Profile
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </DemoStyle.DemoHolder>
      </Grid>
      <DemoStyle.SpacedHeader>
        <Typography component="h1" align="center" style={{ fontSize: "2em" }}>
          Key Moments
        </Typography>
      </DemoStyle.SpacedHeader>
      <Grid item xs={12} style={{ margin: "50px 0 0 0" }}>
        <DemoStyle.DemoHolder>
          <Paper className={classes.paper} style={{ border: "none" }}>
            <DemoStyle.WrapHolder>
              <DemoStyle.ImageHolder>
                <DemoStyle.ImageTitle>Admin Page</DemoStyle.ImageTitle>
                <DemoStyle.DemoImage
                  title="adminPage"
                  src={"/hosthome/img/adminPageThumb.png"}
                  alt={"Admin Page"}
                  onClick={e => showPic(e)}
                />
              </DemoStyle.ImageHolder>
              <DemoStyle.ImageHolder>
                <DemoStyle.ImageTitle>Guest Matches</DemoStyle.ImageTitle>
                <DemoStyle.DemoImage
                  title="guestMatches"
                  src={"/hosthome/img/guestMatchesThumb.png"}
                  alt={"Guest Matches"}
                  onClick={e => showPic(e)}
                />
              </DemoStyle.ImageHolder>
              <DemoStyle.ImageHolder>
                <DemoStyle.ImageTitle>
                  Interested/Not Interested Buttons
                </DemoStyle.ImageTitle>
                <DemoStyle.DemoImage
                  title="interestButtons"
                  src={"/hosthome/img/interestButtonsThumb.png"}
                  alt={"Interest Buttons"}
                  onClick={e => showPic(e)}
                />
              </DemoStyle.ImageHolder>
              <DemoStyle.ImageHolder>
                <DemoStyle.ImageTitle>
                  Annotation of Interested
                </DemoStyle.ImageTitle>
                <DemoStyle.DemoImage
                  title="annotationOfInterested"
                  src={"/hosthome/img/annotationOfInterestedThumb.png"}
                  alt={"Annotation of Interested"}
                  onClick={e => showPic(e)}
                />
              </DemoStyle.ImageHolder>
              <DemoStyle.ImageHolder>
                <DemoStyle.ImageTitle>
                  Annotation of Decline
                </DemoStyle.ImageTitle>
                <DemoStyle.DemoImage
                  title="annotationOfDecline"
                  src={"/hosthome/img/annotationOfDeclineThumb.png"}
                  alt={"Annotation of Decline"}
                  onClick={e => showPic(e)}
                />
              </DemoStyle.ImageHolder>
            </DemoStyle.WrapHolder>
          </Paper>
        </DemoStyle.DemoHolder>
      </Grid>
    </DemoStyle.MainHolder>
  )
}
