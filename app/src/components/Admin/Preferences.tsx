import * as React from "react";

import { makeStyles, Paper, createStyles, Grid, Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, ValueLabelProps, List, ListItem, ListItemAvatar, Avatar, ListItemText } from "@material-ui/core";
import { useHostHomeData } from "../../data/data-context"
import { MatchResult, Guest, Host, GuestInterestLevel, HostQuestion, HostResponse, ResponseValue, Restriction, GuestResponse, GuestQuestion } from "../../models";
import { useParams, useHistory, useLocation } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faPaw, faSmokingBan, faWineBottle, faPrescriptionBottleAlt, faSmoking, faBaby, faUsers, faBed, faHeart } from "@fortawesome/free-solid-svg-icons";

import { HostHomeType } from "../../models/HostHomeType";
import { AdminGuestStyle } from "../../pages/style"


const useStyles = makeStyles(theme => (
    createStyles({
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
    })));


const Preferences = () => {
    const classes = useStyles({});
    const { id } = useParams();
    const guestId = parseInt(id || '-1');
    const {
        data,
        guestQuestionsByKey
    } = useHostHomeData();


    const guest: Guest = data.guests.find((g: Guest) => g.id === guestId) || {} as Guest;
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
    )

}


export default Preferences