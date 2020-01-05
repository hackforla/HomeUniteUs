import * as React from 'react';
import { Grid, Paper, makeStyles, createStyles, Typography, Box, Button } from '@material-ui/core';
import { useHostHomeData } from '../data/data-context';
import { GuestMatchSummary } from '../viewmodels/GuestMatchSummary';
import { MatchResult, Guest } from '../models';
import { useHistory } from 'react-router';

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
        }
    })));



export const AdminView = () => {

    const classes = useStyles({});
    
    const {
        data,
        dispatch,
        addGuest
    } = useHostHomeData();
    
    const history = useHistory();

    const allGuestMatches = React.useMemo(() => {

        return data.guests.map((guest: Guest) => {

            const guestMatches = data.matchResults.filter(
                (matchResult: MatchResult) => guest.id === matchResult.guestId && matchResult.restrictionsFailed.length < 1);

            const guestMatchSummary: GuestMatchSummary = {
                guestId: guest.id,
                guestName: guest.name,
                numMatches: guestMatches.length
            };

            return guestMatchSummary;
            
        });

        
    }, [data.guests, data.matchResults]);


    return (
        <React.Fragment>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Typography
                            component='h2'
                            variant='h5'
                            color='inherit'
                            align='center'
                        >
                            Guests
                    </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        {
                            allGuestMatches.map((guestMatchSummary: GuestMatchSummary, index: number) => (
                                <Box display='flex' p={1} m={1}>
                                    <Box p={1} flexGrow={1}>
                                        <Typography component='h5' align='left'>{guestMatchSummary.guestName}</Typography>                                
                                    </Box>
                                    <Box p={1}>
                                        <Button 
                                            onClick={
                                                () => {
                                                    history.push(`/admin/guest/${guestMatchSummary.guestId}`);
                                                }
                                            }
                                        >
                                            {`${guestMatchSummary.numMatches} matches`}
                                        </Button>
                                    </Box>
                                </Box>                                
                            ))
                        }                            
                    </Paper>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};