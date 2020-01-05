
import * as React from "react";
import { makeStyles, Paper, createStyles, Grid, Box, Typography } from '@material-ui/core';
import { useHostHomeData } from "../data/data-context";
import { GuestMatchSummary } from "../viewmodels/GuestMatchSummary";
import { MatchResult, Guest } from "../models";
import { useParams } from "react-router";

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



export const AdminGuestView = () => {

    const classes = useStyles({});
    const { id } = useParams();

    return (
        <React.Fragment>
            <Grid container spacing={3}>
                <Grid item xs={3}>
                    <Paper className={classes.paper}>Photo</Paper>
                </Grid>
                <Grid item xs={9}>
                    <Paper className={classes.paper}>
                        <Box display='flex' p={1} m={1}>
                            <Box p={1} flexGrow={1}>
                                <Typography component='h5' align='left'>Guest ID</Typography>
                            </Box>
                            <Box p={1}>
                                <Typography component='h5' align='left'>{id}</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>Matches</Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>Unmatched</Paper>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};