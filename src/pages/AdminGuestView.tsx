import * as React from "react";

import { makeStyles, Paper, createStyles, Grid, Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, ValueLabelProps, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@material-ui/core';
import { useHostHomeData } from "../data/data-context";
import { MatchResult, Guest, Host, GuestInterestLevel, HostQuestion, HostResponse, ResponseValue, Restriction, GuestResponse, GuestQuestion } from "../models";
import { useParams, useHistory, useLocation } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle, faPaw, faSmokingBan, faWineBottle, faPrescriptionBottleAlt, faSmoking, faBaby } from "@fortawesome/free-solid-svg-icons";

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
            fontWeight: 'bolder',
            height: '100%',
            width: '100%'
        },
        passedQuestion: {
            backgroundColor: '#ecf0f1'
        },
        tableHeader: {
            backgroundColor: '#008DA7',
            // fontFamily: 'Brandon Grotesque',
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: '16px',
            lineHeight: '22px',
            color: '#FFFFFF'
        },
        tableHeaderCell: {
            // fontFamily: 'Brandon Grotesque',
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: '16px',
            lineHeight: '22px',
            color: '#FFFFFF'
        },
        tableRowOdd: {
            // fontFamily: 'Brandon Grotesque',
            backgroundColor: '#FFFFFF'
        },
        tableRowEven: {
            // fontFamily: 'Brandon Grotesque',
            backgroundColor: '#F5F5F5'
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
        addGuest,
        guestsById,
        guestsResponsesByGuestId,
        guestQuestionsById,
        guestQuestionsByKey
    } = useHostHomeData();

    const petsKeys = ['pets_have', 'host_pets'];

    const havePetsQuestion = guestQuestionsByKey.get('pets_have') as GuestQuestion;
    const hostPetsQuestion = guestQuestionsByKey.get('host_pets') as GuestQuestion;



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





    // const unmatched = React.useMemo(() => {
    //     return data.hosts.filter((host: Host) => matched.filter((matchedHost: Host) => host.id === matchedHost.id).length < 1)
    // }, [data.matchResults]);

    // const unmatched = React.useMemo(() => {
    //     return data.hosts.filter((host: Host) => matched.filter((matchedHost: Host) => host.id === matchedHost.id).length < 1)
    // }, [data.matchResults]);

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




    console.log(`hostQuestionsFailed: ${JSON.stringify(hostQuestionsFailed)}`);

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

    const guestResponsesByKey = data.guestResponses
        .filter((r: GuestResponse) => {
            return r.guestId === guest.id;
        })
        .reduce<Map<string, string>>((prev: Map<string, string>, cur: GuestResponse) => {
            prev.set(
                (data.guestQuestions.find((q: GuestQuestion) => q.id === cur.questionId) as GuestQuestion).questionKey,
                (data.responseValues.find((rv: ResponseValue) => rv.id == cur.responseValues[0]) as ResponseValue).text
            )
            return prev;
        }, new Map<string, string>());

    const questionsByKey = data.guestQuestions
        .reduce<Map<string, GuestQuestion>>((prev: Map<string, GuestQuestion>, cur: GuestQuestion) => {
            prev.set(cur.questionKey, cur);
            return prev;
        }, new Map<string, GuestQuestion>());



    const parentingResponse = guestResponsesByKey.get('parenting_guest') as string;
    const parenting = parentingResponse.toUpperCase() === 'YES';




    const firstCol = [
        'guests_relationship',
        'parenting_guest',
        'pets_have'
    ];

    const secondCol = [
        'smoking_household_acceptable',
        'drinking_household_acceptable',
        'substances_household_acceptable'
    ];


    return (
        <React.Fragment>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Typography 
                        component='h1' 
                        align='center'
                        style={{ fontSize: '2em' }}
                        >
                            Guest Matches
                            </Typography>
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
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography
                                    align='left'
                                    component='h1'
                                    style={{ fontSize: '1.4em' }}
                                    >
                                    {`${guest.name}, ${((new Date()).getFullYear() - guest.dateOfBirth.getFullYear())}`}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <List>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <FontAwesomeIcon icon={faSmoking} size="sm" />                                                
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={guest.smokingText} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <FontAwesomeIcon icon={faWineBottle} />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={guest.drinkingText} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <FontAwesomeIcon icon={faPrescriptionBottleAlt} />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={guest.substancesText} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <FontAwesomeIcon icon={faPaw} />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={guest.petsText} />
                                    </ListItem>
                                    {
                                        parenting
                                        ? <ListItem>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <FontAwesomeIcon icon={faBaby} />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary='I am parenting' />
                                    </ListItem>
                                    : null
                                    }
                                    
                                </List>
                            </Grid>
                            {/* Tyler, 1/27: display smokingText, etc. TODO: logically derive */}
                            {/* <Grid item xs={6}>
                                {
                                    firstCol.map((col: string) => <Typography align='left' component='h4'>
                                        {
                                            `${(questionsByKey.get(col) as GuestQuestion || { text: '' }).text}: ${guestResponsesByKey.get(col) as string}`
                                        }
                                    </Typography>)
                                }
                            </Grid>
                            <Grid item xs={6}>
                                {
                                    secondCol.map((col: string) => <Typography align='left' component='h4'>
                                        {
                                            `${(questionsByKey.get(col) as GuestQuestion || { text: '' }).text}: ${guestResponsesByKey.get(col) as string}`
                                        }
                                    </Typography>)
                                }

                            </Grid> */}
                        </Grid>
                    </Paper>

                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Typography component='h2' align='left'>Matched</Typography>
                        <Table className={classes.table} aria-label="matched table">
                            <TableHead>
                                <TableRow className={classes.tableHeader}>
                                    {/* <TableCell className={classes.tableHeaderCell}>ID</TableCell> */}
                                    <TableCell className={classes.tableHeaderCell}>Name</TableCell>
                                    <TableCell className={classes.tableHeaderCell}>Address</TableCell>
                                    {
                                        data.hostQuestions.map((q: HostQuestion) => {
                                            return (
                                                <TableCell className={classes.tableHeaderCell}>{q.displayName}</TableCell>
                                            );
                                        })
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    matched.map(
                                        (host: Host, index: number) => <>
                                            <TableRow key={index} className={index % 2 === 0 ? classes.tableRowEven : classes.tableRowOdd}>
                                                {/* <TableCell>{host.id}</TableCell> */}
                                                <TableCell onClick={() => { history.push(`/hosthome/guests/${guestId}/matches/${host.id}`) }}>
                                                    <div className='host-match-btn' style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{host.name}</div>
                                                    {/* <div style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{host.name}</div> */}
                                                </TableCell>
                                                <TableCell>{host.address}</TableCell>

                                                {
                                                    data.hostQuestions.map((q: HostQuestion, index: number) => {
                                                        return (
                                                            <TableCell key={index}>
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
                                                                                return <div key={index}><FontAwesomeIcon
                                                                                icon={faCheckCircle}
                                                                                style={{
                                                                                    'color': '#55bdd9'
                                                                                }}
                                                                            />
                                                                                <span style={{ paddingLeft: '4px' }}>{rv.text}</span>
                                                                            </div>

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
                        <Typography component='h2' align='left'>Declined</Typography>
                        <Table className={classes.table} aria-label="unmatched table">
                            <TableHead>
                                <TableRow className={classes.tableHeader}>
                                    {/* <TableCell>ID</TableCell> */}
                                    <TableCell className={classes.tableHeaderCell}>Name</TableCell>
                                    <TableCell className={classes.tableHeaderCell}>Address</TableCell>
                                    {
                                        data.hostQuestions.map((q: HostQuestion, index: number) => {
                                            return (
                                                <TableCell className={classes.tableHeaderCell} key={index}>{q.displayName}</TableCell>
                                            );
                                        })
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    rejected.map(
                                        (host: Host, index: number) => <TableRow key={index} className={index % 2 === 0 ? classes.tableRowEven : classes.tableRowOdd}>
                                            {/* <TableCell>{host.id}</TableCell> */}
                                            <TableCell onClick={() => { history.push(`/hosthome/guests/${guestId}/matches/${host.id}`) }}>
                                                <div className='host-match-btn' style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{host.name}</div>
                                            </TableCell>
                                            <TableCell>{host.address}</TableCell>
                                            {
                                                data.hostQuestions.map((q: HostQuestion, index: number) => {
                                                    return (
                                                        <TableCell key={index}>
                                                            {
                                                                (() => {
                                                                    var response = data.hostResponses
                                                                        .find((hr: HostResponse) => hr.hostId == host.id && hr.questionId == q.id);
                                                                    if (!response) {
                                                                        return 'Not answered';
                                                                    }
                                                                    return response
                                                                        .responseValues
                                                                        .map((rvId: number, index: number) => {

                                                                            const rv = data.responseValues
                                                                                .find((rv: ResponseValue) => rv.id === rvId);
                                                                            if (!rv) {
                                                                                throw new Error(`Unknown response value ID: ${rvId}`);
                                                                            }
                                                                            return <div key={index}><FontAwesomeIcon
                                                                            icon={faCheckCircle}
                                                                            style={{
                                                                                'color': '#55bdd9'
                                                                            }}
                                                                        />
                                                                            <span style={{ paddingLeft: '4px' }}>{rv.text}</span>
                                                                        </div>

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

                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Typography component='h2' align='left'>Unmatched</Typography>
                        <Table className={classes.table} aria-label="unmatched table">
                            <TableHead>
                                <TableRow className={classes.tableHeader}>
                                    {/* <TableCell>ID</TableCell> */}
                                    <TableCell className={classes.tableHeaderCell}>Name</TableCell>
                                    <TableCell className={classes.tableHeaderCell}>Address</TableCell>
                                    {
                                        data.hostQuestions.map((q: HostQuestion, index: number) => {
                                            return (
                                                <TableCell className={classes.tableHeaderCell} key={index}>{q.displayName}</TableCell>
                                            );
                                        })
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    unmatched.map(
                                        (host: Host, index: number) => <TableRow key={index} className={index % 2 === 0 ? classes.tableRowEven : classes.tableRowOdd}>
                                            {/* <TableCell>{host.id}</TableCell> */}
                                            <TableCell>
                                                <div className='host-match-btn' style={{ fontWeight: 'bold' }}>{host.name}</div>
                                            </TableCell>
                                            <TableCell>{host.address}</TableCell>
                                            {
                                                data.hostQuestions.map((q: HostQuestion, index: number) => {
                                                    console.log(`****************************************************************`)
                                                    console.log(`data.hostQuestions.map: looking at q: ${JSON.stringify(q)}`)
                                                    return (
                                                        <TableCell key={index}>
                                                            {
                                                                (() => {
                                                                    var response = data.hostResponses
                                                                        .find((hr: HostResponse) => hr.hostId == host.id && hr.questionId == q.id);

                                                                        
                                                                        console.log(`data.hostQuestions.map: looking at response: ${JSON.stringify(response)}`)

                                                                    if (!response) {
                                                                        return 'Not answered';
                                                                    }
                                                                    return response
                                                                        .responseValues
                                                                        .map((rvId: number, index: number) => {

                                                                            const rv = data.responseValues
                                                                                .find((rv: ResponseValue) => rv.id === rvId);
                                                                            if (!rv) {
                                                                                throw new Error(`Unknown response value ID: ${rvId}`);
                                                                            }
                                                                            // return <div
                                                                            //     className={
                                                                            //         hostQuestionsFailed.has(host.id)
                                                                            //             && (hostQuestionsFailed.get(host.id) as Array<number>).find((n: number) => n === q.id)
                                                                            //             ? classes.failedQuestion
                                                                            //             : ''
                                                                            //     }>
                                                                            //     {rv.text}
                                                                            // </div>;

                                                                            console.log(`data.hostQuestions.map: looking at rv: ${JSON.stringify(rv)}`)

                                                                            const failedQuestionsForHost =hostQuestionsFailed.get(host.id) as Array<number>;
                                                                            
                                                                            console.log(`data.hostQuestions.map: looking at failedQuestionsForHost: ${JSON.stringify(failedQuestionsForHost)}`);

                                                                            // const isFailed = (!!(failedQuestionsForHost.find((n: number) => n === q.id)));
                                                                            const isFailed = failedQuestionsForHost.indexOf(q.id) >= 0;

                                                                            console.log(`data.hostQuestions.map: looking at isFailed: ${JSON.stringify(isFailed)}`);

                                                                            return <div key={index}><FontAwesomeIcon
                                                                                icon={
                                                                                    isFailed ? faTimesCircle : faCheckCircle
                                                                                }
                                                                                style={
                                                                                    isFailed
                                                                                        ? {
                                                                                            'color': 'red'
                                                                                        }
                                                                                        : {
                                                                                            'color': '#55bdd9'
                                                                                        }
                                                                                }
                                                                            />
                                                                                <span style={{ paddingLeft: '4px' }}>{rv.text}</span>
                                                                            </div>

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