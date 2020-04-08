import * as React from "react";

import { useHostHomeData } from "../data/data-context";
import { MatchResult, Guest, Host, GuestInterestLevel } from "../models";
import { useParams, useLocation } from "react-router";
import { AdminGuestStyle } from "./style"
<<<<<<< HEAD
// import './AdminGuestView.css';
// test

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
            backgroundColor: '#00AAEF',
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: '16px',
            lineHeight: '22px',
            color: '#FFFFFF'
        },
        tableHeaderCell: {
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: '16px',
            lineHeight: '22px',
            color: '#FFFFFF'
        },
        matchingHeaderCell: {
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: '16px',
            lineHeight: '22px',
            color: '#FFFFFF',
            textAlign: 'center'
        },
        tableRowOdd: {
            backgroundColor: '#FFFFFF'
        },
        tableRowEven: {
            backgroundColor: '#F5F5F5'
        }
    })));
=======
import MatchTable from '../components/Admin/Table'
import Preferences from '../components/Admin/Preferences'
>>>>>>> ae3e74edaac48f6f1ed314f6f015e4e447621130



export const AdminGuestView = () => {

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
            <AdminGuestStyle.AdminGuestMainHolder>
                {/* Page Title */}
                <AdminGuestStyle.MainHeader>
                    <AdminGuestStyle.MainTitle>
                        Guest Matches
                        </AdminGuestStyle.MainTitle>
                </AdminGuestStyle.MainHeader>

                <AdminGuestStyle.AdminGuestHolders>
                    <AdminGuestStyle.NoWrapHolder>
                        {/* Profile Photo & Preferences */}

                        <AdminGuestStyle.AdminGuestPaper >
                            <img
                                src={guest.imageUrl}
                                width={'400em'}
                                alt='Profile Photo'
                            />
                        </AdminGuestStyle.AdminGuestPaper>
                        <Preferences />

                    </AdminGuestStyle.NoWrapHolder>
                </AdminGuestStyle.AdminGuestHolders>

                {/* Match tables */}
                <MatchTable tableName='Matched' hostList={matched} allowClick={true} displayInterested={true} />
                <MatchTable tableName='Declined' hostList={rejected} allowClick={true} displayInterested={true} />
                <MatchTable tableName='Unmatched' hostList={unmatched} allowClick={true} displayInterested={false} />

            </AdminGuestStyle.AdminGuestMainHolder>
        </React.Fragment>
    );
};