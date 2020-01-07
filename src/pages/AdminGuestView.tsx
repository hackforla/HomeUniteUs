
import * as React from "react";
import { makeStyles, Paper, createStyles, Grid, Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, ValueLabelProps } from '@material-ui/core';
import { useHostHomeData } from "../data/data-context";
import { GuestMatchSummary } from "../viewmodels/GuestMatchSummary";
import { MatchResult, Guest, Host, GuestInterestLevel } from "../models";
import { useParams, useHistory } from "react-router";
import { ProfilePhoto } from "../img/ProfilePhoto";


const useStyles = makeStyles(theme => (
    createStyles({
        root: {
            flexGrow: 1
        },
        toolbar: {
            borderBottom: `1px solid ${theme.palette.divider}`,
        },
        toolbarTitle: {
            flex: 1,
        },
        toolbarSecondary: {
            justifyContent: 'space-between',
            overflowX: 'auto',
        },
        toolbarLink: {
            padding: theme.spacing(1),
            flexShrink: 0,
        },
        mainFeaturedPost: {
            position: 'relative',
            backgroundColor: theme.palette.grey[800],
            color: theme.palette.common.white,
            marginBottom: theme.spacing(4),
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
        },
        overlay: {
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.3)',
        },
        mainFeaturedPostContent: {
            position: 'relative',
            padding: theme.spacing(3),
            [theme.breakpoints.up('md')]: {
                padding: theme.spacing(6),
                paddingRight: 0,
            },
        },
        mainGrid: {
            marginTop: theme.spacing(3),
        },
        card: {
            display: 'flex',
        },
        cardDetails: {
            flex: 1,
        },
        cardMedia: {
            width: 160,
        },
        markdown: {
            ...theme.typography.body2,
            padding: theme.spacing(3, 0),
        },
        sidebarAboutBox: {
            padding: theme.spacing(2),
            backgroundColor: theme.palette.grey[200],
        },
        sidebarSection: {
            marginTop: theme.spacing(3),
        },
        footer: {
            backgroundColor: theme.palette.background.paper,
            marginTop: theme.spacing(8),
            padding: theme.spacing(6, 0),
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
        table: {
            minWidth: 650,
        }
    })));

interface InterestDescription {
    interested: GuestInterestLevel;
    lastUpdated: Date;
}

interface InterestMapping {
    [key: number]: InterestDescription;
}

export const AdminGuestView = () => {

    const classes = useStyles({});
    const { id } = useParams();
    const guestId = parseInt(id || '-1');


    const {
        data,
        dispatch,
        addGuest
    } = useHostHomeData();

    const history = useHistory();

    const guest: Guest = data.guests.find((g: Guest) => g.id === guestId) || {} as Guest;

    const matched = React.useMemo(() => {

        return data.hosts.filter((host: Host) => {
            return data.matchResults.filter((matchResult: MatchResult) => (
                matchResult.guestId === guestId
                && matchResult.hostId === host.id
                && matchResult.restrictionsFailed.length < 1
            )).length > 0;
        });
    }, [data.hosts, data.matchResults]);


    const unmatched = React.useMemo(() => {
        return data.hosts.filter((host: Host) => matched.filter((matchedHost: Host) => host.id === matchedHost.id).length < 1)
    }, [data.matchResults]);


    const interestByHostId: InterestMapping = React.useMemo(() => {
        return data.matchResults
            .filter((matchResult: MatchResult) => matchResult.guestId === guestId)
            .reduce<InterestMapping>((map: InterestMapping, matchResult: MatchResult, index: number) => {
                map[matchResult.hostId] = {
                    interested: matchResult.guestInterestLevel,
                    lastUpdated: matchResult.lastInterestUpdate
                };
                return map;
            }, {} as InterestMapping);
    }, [data.matchResults]);

    return (
        <React.Fragment>
            <Grid container spacing={3}>
                <Grid item xs={3}>
                    <Paper className={classes.paper}>
                        <img
            src={guest.imageUrl}
            width={200}
            alt='Profile Photo'
        />
                    </Paper>
                </Grid>
                <Grid item xs={9}>
                    <Paper className={classes.paper}>
                        <Box display='flex' p={1} m={1}>
                            <Box p={1} flexGrow={1}>
                                <Typography component='h5' align='left'>Guest ID</Typography>
                            </Box>
                            <Box p={1}>
                                <Typography component='h5' align='left'>{guestId}</Typography>
                            </Box>
                        </Box>
                    </Paper>

                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Typography component='h4' align='left'>Matched</Typography>
                        <Table className={classes.table} aria-label="matched table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Address</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    matched.map(
                                        (host: Host, index: number) => <>
                                            <TableRow key={index}>
                                                <TableCell>{host.id}</TableCell>
                                                <TableCell>{host.address}</TableCell>
                                            </TableRow>
                                            {
                                                interestByHostId[host.id].interested === GuestInterestLevel.Interested
                                                    ? <TableRow key={index}>
                                                        <TableCell
                                                            colSpan={2}
                                                            style={{
                                                                backgroundColor: 'green'
                                                            }} 
                                                        >
                                                            {`Guest indicated interest at ${interestByHostId[host.id].lastUpdated.toLocaleString()}`}
                                                        </TableCell>
                                                    </TableRow>
                                                    : null
                                            }
                                        </>

                                    )
                                }
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Typography component='h4' align='left'>Unmatched</Typography>
                        <Table className={classes.table} aria-label="unmatched table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Address</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    unmatched.map(
                                        (host: Host, index: number) => <TableRow key={index}>
                                            <TableCell>{host.id}</TableCell>
                                            <TableCell>{host.address}</TableCell>
                                        </TableRow>
                                    )
                                }
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};