
import * as React from "react";
import { makeStyles, Paper, createStyles, Grid, Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, ValueLabelProps } from '@material-ui/core';
import { useHostHomeData } from "../data/data-context";
import { GuestMatchSummary } from "../viewmodels/GuestMatchSummary";
import { MatchResult, Guest, Host, GuestInterestLevel, HostQuestion, HostResponse, ResponseValue, Restriction } from "../models";
import { useParams, useHistory } from "react-router";
import { ProfilePhoto } from "../img/ProfilePhoto";
import './AdminGuestView.css';

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
        },
        failedQuestion: {
            backgroundColor: 'red',
            fontWeight: 'bolder',
            height: '100%',
            width: '100%'
        },
        passedQuestion: {
            backgroundColor: '#ecf0f1'
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
                && matchResult.guestInterestLevel !== GuestInterestLevel.NotInterested
            )).length > 0;
        });
    }, [data.hosts, data.matchResults]);



    const unmatched = React.useMemo(() => {
        return data.hosts.filter((host: Host) => matched.filter((matchedHost: Host) => host.id === matchedHost.id).length < 1)
    }, [data.matchResults]);

    const hostQuestionsFailed = data.matchResults
        .filter((matchResult: MatchResult) => (
            matchResult.guestId === guestId
            && (matchResult.restrictionsFailed.length > 0 || matchResult.guestInterestLevel === GuestInterestLevel.NotInterested)
        ))
        .reduce<Map<number, Array<number>>>((prev: Map<number, Array<number>>, cur: MatchResult) => {

            // console.log(`hostQuestionsFailed: adding cur: ${JSON.stringify(cur)}`);
            // console.log(` ... to prev: ${JSON.stringify(prev)}`);

            prev.set(cur.hostId, cur.restrictionsFailed.map((r: Restriction) => r.hostQuestionId));

            return prev;

        }, new Map<number, Array<number>>());


    // console.log(`hostQuestionsFailed ${JSON.stringify(hostQuestionsFailed)}`);

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
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Typography component='h1' align='center'>Guest Matches</Typography>
                    </Paper>
                </Grid>
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
                                <Typography component='h5' align='right'>{guestId}</Typography>
                            </Box>
                        </Box>
                        <Box display='flex' p={1} m={1}>
                            <Box p={1} flexGrow={1}>
                                <Typography component='h5' align='left'>Name</Typography>
                            </Box>
                            <Box p={1}>
                                <Typography component='h5' align='right'>{guest.name}</Typography>
                            </Box>
                        </Box>
                        <Box display='flex' p={1} m={1}>
                            <Box p={1} flexGrow={1}>
                                <Typography component='h5' align='left'>Email</Typography>
                            </Box>
                            <Box p={1}>
                                <Typography component='h5' align='right'>{guest.email}</Typography>
                            </Box>
                        </Box>
                        <Box display='flex' p={1} m={1}>
                            <Box p={1} flexGrow={1}>
                                <Typography component='h5' align='left'>Pets</Typography>
                            </Box>
                            <Box p={1}>
                                <Typography component='h5' align='right'>{guest.petsText}</Typography>
                            </Box>
                        </Box>
                        <Box display='flex' p={1} m={1}>
                            <Box p={1} flexGrow={1}>
                                <Typography component='h5' align='left'>Drinking</Typography>
                            </Box>
                            <Box p={1}>
                                <Typography component='h5' align='right'>{guest.drinkingText}</Typography>
                            </Box>
                        </Box>
                        <Box display='flex' p={1} m={1}>
                            <Box p={1} flexGrow={1}>
                                <Typography component='h5' align='left'>Substances</Typography>
                            </Box>
                            <Box p={1}>
                                <Typography component='h5' align='right'>{guest.substancesText}</Typography>
                            </Box>
                        </Box>
                        <Box display='flex' p={1} m={1}>
                            <Box p={1} flexGrow={1}>
                                <Typography component='h5' align='left'>Smoking</Typography>
                            </Box>
                            <Box p={1}>
                                <Typography component='h5' align='right'>{guest.smokingText}</Typography>
                            </Box>
                        </Box>
                        <Box display='flex' p={1} m={1}>
                            <Box p={1} flexGrow={1}>
                                <Typography component='h5' align='left'>Pets</Typography>
                            </Box>
                            <Box p={1}>
                                <Typography component='h5' align='right'>{guest.petsText}</Typography>
                            </Box>
                        </Box>
                        <Box display='flex' p={1} m={1}>
                            <Box p={1} flexGrow={1}>
                                <Typography component='h5' align='left'>Employment Information</Typography>
                            </Box>
                            <Box p={1}>
                                <Typography component='h5' align='right'>{guest.employmentInfo}</Typography>
                            </Box>
                        </Box>
                        <Box display='flex' p={1} m={1}>
                            <Box p={1} flexGrow={1}>
                                <Typography component='h5' align='left'>Guest Introduction</Typography>
                            </Box>
                            <Box p={1}>
                                <Typography component='h5' align='right'>{guest.guestIntro}</Typography>
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
                                    <TableCell>Name</TableCell>
                                    <TableCell>Address</TableCell>
                                    {
                                        data.hostQuestions.map((q: HostQuestion) => {
                                            return (
                                                <TableCell>{q.questionKey}</TableCell>
                                            );
                                        })
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    matched.map(
                                        (host: Host, index: number) => <>
                                            <TableRow key={index}>
                                                <TableCell>{host.id}</TableCell>
                                                <TableCell onClick={() => { history.push(`/hosthome/guests/${guestId}/matches/${host.id}`) }}>
                                                    <div style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{host.name}</div>
                                                </TableCell>
                                                <TableCell>{host.address}</TableCell>

                                                {
                                                    data.hostQuestions.map((q: HostQuestion) => {
                                                        return (
                                                            <TableCell>
                                                                {
                                                                    (() => {
                                                                        var response = data.hostResponses
                                                                            .find((hr: HostResponse) => hr.hostId == host.id && hr.questionId == q.id);
                                                                        if (!response) {
                                                                            return 'Not answered';
                                                                        }
                                                                        return response
                                                                            .responseValues
                                                                            .map((rvId: number) => {


                                                                                const rv = data.responseValues
                                                                                    .find((rv: ResponseValue) => rv.id === rvId);
                                                                                if (!rv) {
                                                                                    throw new Error(`Unknown response value ID: ${rvId}`);
                                                                                }
                                                                                return rv.displayText || rv.text;

                                                                            })
                                                                    })()
                                                                }
                                                            </TableCell>
                                                        );
                                                    })
                                                }
                                            </TableRow>
                                            {
                                                interestByHostId[host.id].interested === GuestInterestLevel.Interested
                                                    ? <TableRow key={index}>
                                                        <TableCell
                                                            colSpan={data.hostQuestions.length + 2}
                                                            style={{
                                                                backgroundColor: '#80e27e'
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
                                    <TableCell>Name</TableCell>
                                    <TableCell>Address</TableCell>
                                    {
                                        data.hostQuestions.map((q: HostQuestion) => {
                                            return (
                                                <TableCell>{q.questionKey}</TableCell>
                                            );
                                        })
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    unmatched.map(
                                        (host: Host, index: number) => <TableRow key={index}>
                                            <TableCell>{host.id}</TableCell>
                                            <TableCell onClick={() => { history.push(`/hosthome/guests/${guestId}/matches/${host.id}`) }}>
                                                <div className='host-match-btn' style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{host.name}</div>
                                            </TableCell>
                                            <TableCell>{host.address}</TableCell>
                                            {
                                                data.hostQuestions.map((q: HostQuestion) => {
                                                    return (
                                                        <TableCell>
                                                            {
                                                                (() => {
                                                                    var response = data.hostResponses
                                                                        .find((hr: HostResponse) => hr.hostId == host.id && hr.questionId == q.id);
                                                                    if (!response) {
                                                                        return 'Not answered';
                                                                    }
                                                                    return response
                                                                        .responseValues
                                                                        .map((rvId: number) => {

                                                                            const rv = data.responseValues
                                                                                .find((rv: ResponseValue) => rv.id === rvId);
                                                                            if (!rv) {
                                                                                throw new Error(`Unknown response value ID: ${rvId}`);
                                                                            }
                                                                            return <div
                                                                                className={
                                                                                    hostQuestionsFailed.has(host.id)
                                                                                        && (hostQuestionsFailed.get(host.id) as Array<number>).find((n: number) => n === q.id)
                                                                                        ? classes.failedQuestion
                                                                                        : ''
                                                                                }>
                                                                                {rv.displayText || rv.text}
                                                                            </div>;

                                                                        })
                                                                })()
                                                            }
                                                        </TableCell>
                                                    );
                                                })
                                            }
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