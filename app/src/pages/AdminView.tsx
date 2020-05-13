import * as React from 'react'
import { useHistory } from 'react-router'
import { useHostHomeData } from '../data/data-context'
import { GuestMatchSummary } from '../viewmodels/GuestMatchSummary'
import { MatchResult, Guest, GuestInterestLevel } from '../models'
import { AdminStyle } from './style'
import { Link } from 'react-router-dom'

export const MatchSummaryRow = (guestMatchSummary: GuestMatchSummary) => {
    const { data } = useHostHomeData()

    const history = useHistory()
    return (
        <AdminStyle.WiderHeaderRow>
            <AdminStyle.AdminLink>
                <Link to={`/hosthome/guests/${guestMatchSummary.guestId}`}>
                    {guestMatchSummary.guestName}
                </Link>
            </AdminStyle.AdminLink>
            <AdminStyle.AdminText>
                {guestMatchSummary.numBids > 0 ? 'Bid' : 'No Selection'}
            </AdminStyle.AdminText>
            <AdminStyle.Button
                onClick={() => {
                    history.push(`/admin/guest/${guestMatchSummary.guestId}`)
                }}
            >
                {`${guestMatchSummary.numMatches} matches`}
            </AdminStyle.Button>
        </AdminStyle.WiderHeaderRow>
    )
}

export const AdminView = () => {
    const { data } = useHostHomeData()

    const allGuestMatches = React.useMemo(() => {
        return data.guests.map((guest: Guest) => {
            const guestMatches = data.matchResults.filter(
                (matchResult: MatchResult) =>
                    guest.id === matchResult.guestId &&
                    matchResult.restrictionsFailed.length < 1 &&
                    matchResult.guestInterestLevel !==
                        GuestInterestLevel.NotInterested
            )

            const guestInterested = data.matchResults.filter(
                (matchResult: MatchResult) =>
                    guest.id === matchResult.guestId &&
                    matchResult.restrictionsFailed.length < 1 &&
                    matchResult.guestInterestLevel ===
                        GuestInterestLevel.Interested
            )

            const guestMatchSummary: GuestMatchSummary = {
                guestId: guest.id,
                guestName: guest.name,
                numMatches: guestMatches.length,
                numBids: guestInterested.length,
            }

            return guestMatchSummary
        })
    }, [data.guests, data.matchResults])

    return (
        <React.Fragment>
            <AdminStyle.MainHolder>
                <AdminStyle.MainHeader>
                    <AdminStyle.MainTitle>
                        All Guests Matching
                    </AdminStyle.MainTitle>
                </AdminStyle.MainHeader>

                <AdminStyle.AdminMatchHolders>
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
                                .sort(
                                    (
                                        a: GuestMatchSummary,
                                        b: GuestMatchSummary
                                    ) => (a.numMatches > b.numMatches ? -1 : 1)
                                )
                                .map(
                                    (
                                        guestMatchSummary: GuestMatchSummary,
                                        index: number
                                    ) => (
                                        <MatchSummaryRow
                                            key={index}
                                            {...guestMatchSummary}
                                        />
                                    )
                                )}
                        </AdminStyle.InfoPaper>
                    </AdminStyle.AdminHolder>
                </AdminStyle.AdminMatchHolders>
            </AdminStyle.MainHolder>
        </React.Fragment>
    )
}
