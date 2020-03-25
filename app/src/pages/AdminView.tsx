import * as React from "react"
import { useHostHomeData } from "../data/data-context"
import { GuestMatchSummary } from "../viewmodels/GuestMatchSummary"
import { MatchResult, Guest, GuestInterestLevel } from "../models"
import { AdminStyle } from './style'
import { Link } from "react-router-dom"
import {
  Grid,
  Typography,
  Button,
} from "@material-ui/core"



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
  // const classes = useStyles({})

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
            <AdminStyle.HeaderRow>
              <AdminStyle.SecondHeader>
                Name
              </AdminStyle.SecondHeader>
              <AdminStyle.SecondHeader>
                Status
                </AdminStyle.SecondHeader>
              <AdminStyle.SecondHeader>
                Matches
                </AdminStyle.SecondHeader>
            </AdminStyle.HeaderRow>

            {allGuestMatches
              .sort((a: GuestMatchSummary, b: GuestMatchSummary) =>
                a.numMatches > b.numMatches ? -1 : 1
              )
              .map(
                (guestMatchSummary: GuestMatchSummary, index: number) => (
                  <MatchSummaryRow key={index} {...guestMatchSummary} />
                )
              )}
          </AdminStyle.InfoPaper>
        </AdminStyle.AdminHolder>
      </AdminStyle.MainHolder>
    </React.Fragment>
  )
}
