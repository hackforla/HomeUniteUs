import * as React from "react";

import { makeStyles, Paper, createStyles, Grid, Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, ValueLabelProps, List, ListItem, ListItemAvatar, Avatar, ListItemText } from "@material-ui/core";
import { useHostHomeData } from "../data/data-context";
import { MatchResult, Guest, Host, GuestInterestLevel, HostQuestion, HostResponse, ResponseValue, Restriction, GuestResponse, GuestQuestion } from "../models";
import { useParams, useHistory, useLocation } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faPaw, faSmokingBan, faWineBottle, faPrescriptionBottleAlt, faSmoking, faBaby, faUsers, faBed, faHeart } from "@fortawesome/free-solid-svg-icons";

import { HostHomeType } from "../models/HostHomeType";
import { AdminGuestStyle } from "./style"
import MatchTable from '../components/Admin/Table'
// import './AdminGuestView.css';

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

interface InterestDescription {
    interested: GuestInterestLevel;
    lastUpdated: Date;
}


export const AdminGuestView = () => {

    const classes = useStyles({});
    const { id } = useParams();
    const guestId = parseInt(id || '-1');

    const {
        data,
        guestQuestionsByKey
    } = useHostHomeData();


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


    const parentingResponse = guestResponsesByKey.get('parenting_guest') as string;
    const parenting = parentingResponse.toUpperCase() === 'YES';


    const relationshipResponse = guestResponsesByKey.get('guests_relationship') as string;
    const relationship = relationshipResponse.toUpperCase() === 'YES';



    const hostTypeDisplay = (t: HostHomeType) => {
        switch (t) {

            case HostHomeType.Full:
                return 'Full Only';

            case HostHomeType.Both:
                return 'Respite/Full';

            case HostHomeType.Respite:
                return 'Respite Only';

            default:
                throw new Error(`Unhandled host home type: ${JSON.stringify(t)}`);

        }
    }


    return (
        <React.Fragment>
            <AdminGuestStyle.MainHolder>

                {/* Page Title */}
                <AdminGuestStyle.MainHeader>
                    <AdminGuestStyle.MainTitle>
                        Guest Matches
                        </AdminGuestStyle.MainTitle>
                </AdminGuestStyle.MainHeader>


                <AdminGuestStyle.AdminMatchHolders>
                    <AdminGuestStyle.NoWrapHolder>

                        {/* Profile Photo */}
                        <Paper className={classes.paper}>
                            <img
                                src={guest.imageUrl}
                                width={'400em'}
                                alt='Profile Photo'
                            />
                        </Paper>

                        {/* List of Preferences/Proclivities */}

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
                                                    <FontAwesomeIcon icon={faUsers} size="sm" />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={`I would like accommodations for ${guest.numberOfGuests} guests`} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <FontAwesomeIcon icon={faBed} size="sm" />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={`${hostTypeDisplay(guest.type)}`} />
                                        </ListItem>
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
                                            relationship
                                                ? <ListItem>
                                                    <ListItemAvatar>
                                                        <Avatar>
                                                            <FontAwesomeIcon icon={faHeart} />
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText primary='I am in a relationship' />
                                                </ListItem>
                                                : null
                                        }
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
                            </Grid>
                        </Paper>
                    </AdminGuestStyle.NoWrapHolder>
                </AdminGuestStyle.AdminMatchHolders>



                <MatchTable tableName='Matched' hostList={matched} allowClick={true} displayInterested={true} />
                <MatchTable tableName='Declined' hostList={rejected} allowClick={true} displayInterested={true} />
                <MatchTable tableName='Unmatched' hostList={unmatched} allowClick={true} displayInterested={false} />


            </AdminGuestStyle.MainHolder>
        </React.Fragment>
    );
};