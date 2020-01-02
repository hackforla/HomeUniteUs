import * as React from 'react';
import { BrowserRouter, Route, Switch, NavLink } from 'react-router-dom';
import { makeStyles, Container, Toolbar, Button, Typography, IconButton, Paper } from '@material-ui/core';
import { Search } from '@material-ui/icons';


const useStyles = makeStyles(theme => ({
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
}));

const LocationManager = () => {
    return (
        <Paper>
            <h1>Locations</h1>
        </Paper>
    );
};

const CandidateManager = () => {
    return (
        <Paper>
            <h1>Candidates</h1>
        </Paper>
    );
};


export const AdminGuestView = () => {

    const classes = useStyles({});

    return (
        <BrowserRouter>
            <Container maxWidth='lg'>
                <Toolbar className={classes.toolbar}>
                    <Typography
                        component='h2'
                        variant='h5'
                        color='inherit'
                        align='center'
                        noWrap
                        className={classes.toolbarTitle}
                    >
                        SHARED HOUSING
                    </Typography>
                </Toolbar>
                <Toolbar
                    className={classes.toolbar}
                >
                <NavLink to='/locations' className={classes.toolbarLink}>Locations</NavLink>
                <NavLink to='/candidates' className={classes.toolbarLink}>Candidates</NavLink>
                </Toolbar>
                <main>
                    <Switch>
                        <Route path='/locations' component={LocationManager} />
                        <Route path='/candidates' component={CandidateManager} />
                    </Switch>
                </main>
            </Container>

        </BrowserRouter>
    );
};
