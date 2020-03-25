import * as React from "react"
import { useHostHomeData } from "../data/data-context"
import { GuestMatchSummary } from "../viewmodels/GuestMatchSummary"
import { MatchResult, Guest, GuestInterestLevel } from "../models"
import { AdminStyle } from './style'
import { Link } from "react-router-dom"
import {
  Grid,
  Paper,
  makeStyles,
  createStyles,
  Typography,
  Button,
  Container
} from "@material-ui/core"

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      flexGrow: 1
    },
    toolbar: {
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    toolbarTitle: {
      flex: 1
    },
    toolbarSecondary: {
      justifyContent: "space-between",
      overflowX: "auto"
    },
    toolbarLink: {
      padding: theme.spacing(1),
      flexShrink: 0
    },
    mainFeaturedPost: {
      position: "relative",
      backgroundColor: theme.palette.grey[800],
      color: theme.palette.common.white,
      marginBottom: theme.spacing(4),
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center"
    },
    overlay: {
      position: "absolute",
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      backgroundColor: "rgba(0,0,0,.3)"
    },
    mainFeaturedPostContent: {
      position: "relative",
      padding: theme.spacing(3),
      [theme.breakpoints.up("md")]: {
        padding: theme.spacing(6),
        paddingRight: 0
      }
    },
    mainGrid: {
      marginTop: theme.spacing(3)
    },
    card: {
      display: "flex"
    },
    cardDetails: {
      flex: 1
    },
    cardMedia: {
      width: 160
    },
    markdown: {
      ...theme.typography.body2,
      padding: theme.spacing(3, 0)
    },
    sidebarAboutBox: {
      padding: theme.spacing(2),
      backgroundColor: theme.palette.grey[200]
    },
    sidebarSection: {
      marginTop: theme.spacing(3)
    },
    footer: {
      backgroundColor: theme.palette.background.paper,
      marginTop: theme.spacing(8),
      padding: theme.spacing(6, 0)
    },
    paperHeader: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary
    },
    paper: {
      padding: theme.spacing(3),
      textAlign: "center",
      color: theme.palette.text.secondary,
      border: "1px solid #ADADAD"
    },
    table: {
      minWidth: 650
    }
  })
)

export const MatchSummaryRow = (guestMatchSummary: GuestMatchSummary) => {
  const { data } = useHostHomeData()

  return (
    <Grid item xs={12} style={{ paddingBottom: "4px" }}>
      <Grid container>
        <Grid item xs={2}>
          <Typography component="p" align="left">
            <Link
              to={`/hosthome/guests/${guestMatchSummary.guestId}`}
            >
              {guestMatchSummary.guestName}
            </Link>
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography component="h3">
            {guestMatchSummary.numBids > 0 ? "Bid" : "No Selection"}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Button
            color="primary"
            variant="contained"
            component={Link}
            style={{ backgroundColor: "#00AAEF" }}
            to={`/hosthome/admin/guest/${guestMatchSummary.guestId}`}
          >
            {`${guestMatchSummary.numMatches} matches`}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

export const AdminView = () => {
  const classes = useStyles({})

  const { data, dispatch, addGuest } = useHostHomeData()

  const allGuestMatches = React.useMemo(() => {
    return data.guests.map((guest: Guest) => {
      const guestMatches = data.matchResults.filter(
        (matchResult: MatchResult) =>
          guest.id === matchResult.guestId &&
          matchResult.restrictionsFailed.length < 1 &&
          matchResult.guestInterestLevel !== GuestInterestLevel.NotInterested
      )

      const guestInterested = data.matchResults.filter(
        (matchResult: MatchResult) =>
          guest.id === matchResult.guestId &&
          matchResult.restrictionsFailed.length < 1 &&
          matchResult.guestInterestLevel === GuestInterestLevel.Interested
      )

      const guestMatchSummary: GuestMatchSummary = {
        guestId: guest.id,
        guestName: guest.name,
        numMatches: guestMatches.length,
        numBids: guestInterested.length
      }

      return guestMatchSummary
    })
  }, [data.guests, data.matchResults])

  return (
    <React.Fragment>
      <AdminStyle.MainHolder>

        <AdminStyle.AdminHeader>
          <AdminStyle.AdminTitle>
            All Guests Matching
          </AdminStyle.AdminTitle>
        </AdminStyle.AdminHeader>

        <AdminStyle.AdminHolder>
          <AdminStyle.InfoPaper>
            {/* <Paper className={classes.paper}> */}
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
                    <Typography component="h3" style={{ fontWeight: "bold" }}>
                      Status
                      </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography component="h3" style={{ fontWeight: "bold" }}>
                      Matches
                      </Typography>
                  </Grid>
                </Grid>
              </Grid>
              {allGuestMatches
                .sort((a: GuestMatchSummary, b: GuestMatchSummary) =>
                  a.numMatches > b.numMatches ? -1 : 1
                )
                .map(
                  (guestMatchSummary: GuestMatchSummary, index: number) => (
                    <MatchSummaryRow key={index} {...guestMatchSummary} />
                  )
                )}
            </Grid>
            {/* </Paper> */}

          </AdminStyle.InfoPaper>
        </AdminStyle.AdminHolder>
      </AdminStyle.MainHolder>
    </React.Fragment>
  )
}
