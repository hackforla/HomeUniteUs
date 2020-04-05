import * as React from "react";

import { makeStyles, Paper, createStyles } from "@material-ui/core";
import { useHostHomeData } from "../data/data-context";
import { MatchResult, Guest, Host, GuestInterestLevel } from "../models";
import { useParams, useHistory, useLocation } from "react-router";
import { AdminGuestStyle } from "./style"
import MatchTable from '../components/Admin/Table'
import Preferences from '../components/Admin/Preferences'


const useStyles = makeStyles(theme => (
    createStyles({
        root: {
            flexGrow: 1
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },

    })));

export const AdminGuestView = () => {

    const classes = useStyles({});
    const { id } = useParams();
    const guestId = parseInt(id || '-1');

    const {
        data,
    } = useHostHomeData();


    const location = useLocation();

    React.useEffect(() => {
        try {
            window.scroll({
                top: 0,
                left: 0,
                behavior: 'auto',
            });
        } catch (error) {
            window.scrollTo(0, 0);
        }
    }, [location.pathname, location.search]);

    const guest: Guest = data.guests.find((g: Guest) => g.id === guestId) || {} as Guest;

    const matched = React.useMemo(() => {
        return data.hosts.filter((host: Host) => {
            return data.matchResults.filter((matchResult: MatchResult) => (
                matchResult.guestId === guestId
                && matchResult.hostId === host.id
                && matchResult.restrictionsFailed.length < 1
                && matchResult.guestInterestLevel !== GuestInterestLevel.NotInterested
            )).length > 0;
        });
    }, [data.hosts, data.matchResults]);

    const unmatched = React.useMemo(() => {
        return data.hosts.filter((host: Host) => {
            return data.matchResults.filter((matchResult: MatchResult) => (
                matchResult.guestId === guestId
                && matchResult.hostId === host.id
                && matchResult.restrictionsFailed.length > 0
            )).length > 0;
        });
    }, [data.hosts, data.matchResults]);

    const rejected = React.useMemo(() => {
        return data.hosts.filter((host: Host) => {
            return data.matchResults.filter((matchResult: MatchResult) => (
                matchResult.guestId === guestId
                && matchResult.hostId === host.id
                && matchResult.restrictionsFailed.length < 1
                && matchResult.guestInterestLevel === GuestInterestLevel.NotInterested
            )).length > 0;
        });
    }, [data.hosts, data.matchResults]);


    return (
        <React.Fragment>
            <AdminGuestStyle.MainHolder>
                {/* Page Title */}
                <AdminGuestStyle.MainHeader>
                    <AdminGuestStyle.MainTitle>
                        Guest Matches
                        </AdminGuestStyle.MainTitle>
                </AdminGuestStyle.MainHeader>

                <AdminGuestStyle.AdminGuestHolders>
                    <AdminGuestStyle.NoWrapHolder>
                        {/* Profile Photo & Preferences */}
                        <Paper className={classes.paper}>
                            <img
                                src={guest.imageUrl}
                                width={'400em'}
                                alt='Profile Photo'
                            />
                        </Paper>

                        <Preferences />

                    </AdminGuestStyle.NoWrapHolder>
                </AdminGuestStyle.AdminGuestHolders>

                {/* Match tables */}
                <MatchTable tableName='Matched' hostList={matched} allowClick={true} displayInterested={true} />
                <MatchTable tableName='Declined' hostList={rejected} allowClick={true} displayInterested={true} />
                <MatchTable tableName='Unmatched' hostList={unmatched} allowClick={true} displayInterested={false} />


            </AdminGuestStyle.MainHolder>
        </React.Fragment>
    );
};