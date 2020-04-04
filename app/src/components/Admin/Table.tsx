
import * as React from "react";

import { makeStyles, Paper, createStyles, Grid, Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, ValueLabelProps, List, ListItem, ListItemAvatar, Avatar, ListItemText } from "@material-ui/core";
import { useHostHomeData } from "../../data/data-context"
import { MatchResult, Guest, Host, GuestInterestLevel, HostQuestion, HostResponse, ResponseValue, Restriction, GuestResponse, GuestQuestion } from "../../models";
import { useParams, useHistory, useLocation } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

import { HostHomeType } from "../../models/HostHomeType";
import { AdminGuestStyle } from "../../pages/style"
// import './AdminGuestView.css';


const useStyles = makeStyles(theme => (
    createStyles({
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
            color: '#FFFFFF',
            textAlign: 'center'
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

interface InterestDescription {
    interested: GuestInterestLevel;
    lastUpdated: Date;
}

interface InterestMapping {
    [key: number]: InterestDescription;
}

const MatchTable = (props: { tableName: string, hostList: Array<Host>, displayInterested: boolean, allowClick: boolean }) => {


    const classes = useStyles({});
    const { id } = useParams();
    const guestId = parseInt(id || '-1');

    const {
        data,
        guestQuestionsByKey
    } = useHostHomeData();


    const history = useHistory();

    const hostQuestionsFailed = data.matchResults
        .filter((matchResult: MatchResult) => (
            matchResult.guestId === guestId
            && (matchResult.restrictionsFailed.length > 0 || matchResult.guestInterestLevel === GuestInterestLevel.NotInterested)
        ))
        .reduce<Map<number, Array<number>>>((prev: Map<number, Array<number>>, cur: MatchResult) => {
            prev.set(cur.hostId, cur.restrictionsFailed.map((r: Restriction) => r.hostQuestionId));
            return prev;
        }, new Map<number, Array<number>>());

    //console.log(`hostQuestionsFailed: ${JSON.stringify(hostQuestionsFailed)}`);

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



    const FailCell = (props: { value: string }) => <div>
        <div style={{ padding: '0px 5px', textAlign: 'center' }}>
            <FontAwesomeIcon
                icon={faTimesCircle}
                style={{ 'color': 'red' }}
            />

        </div>
        <div style={{ padding: '0px 3px', textAlign: 'center' }}>{props.value}</div>
    </div>;

    const SuccessCell = (props: { value: string }) => <div style={{ padding: '0px 3px', textAlign: 'center' }}>
        {props.value}
    </div>


    return (
        <AdminGuestStyle.AdminMatchHolders>
            <Paper className={classes.paper}>
                <Typography component='h2' align='left'>{props.tableName}</Typography>
                <AdminGuestStyle.TableHeaderRow className={classes.tableHeader}>
                    <AdminGuestStyle.TableHeaderLabel className={classes.matchingHeaderCell}>Name</AdminGuestStyle.TableHeaderLabel >
                    <AdminGuestStyle.TableHeaderLabel className={classes.matchingHeaderCell}>Address</AdminGuestStyle.TableHeaderLabel >
                    {
                        data.hostQuestions.map((q: HostQuestion, index: number) => {
                            return (
                                <AdminGuestStyle.TableHeaderLabel className={classes.matchingHeaderCell} key={index}>{q.displayName}</AdminGuestStyle.TableHeaderLabel>
                            );
                        })
                    }
                </AdminGuestStyle.TableHeaderRow>

                {
                    props.hostList.map(
                        (host: Host, index: number) => <><AdminGuestStyle.TableRow key={index} className={index % 2 === 0 ? classes.tableRowEven : classes.tableRowOdd}>
                            <AdminGuestStyle.TableCell onClick={
                                props.allowClick
                                    ? () => {
                                        console.log(`AdminGuestView:MatchTable: guestId = ${guestId}`);
                                        console.log(`AdminGuestView:MatchTable: host.id = ${host.id}`);
                                        history.push(`/hosthome/guests/${guestId}/matches/${host.id}`)
                                    }
                                    : () => { }
                            }>
                                <AdminGuestStyle.HostMatchClick>
                                    {host.name}
                                </AdminGuestStyle.HostMatchClick>
                            </AdminGuestStyle.TableCell>


                            <AdminGuestStyle.TableCell>{host.address}</AdminGuestStyle.TableCell>
                            {
                                data.hostQuestions.map((q: HostQuestion, index: number) => {
                                    return (
                                        <AdminGuestStyle.TableCell key={index}>
                                            {
                                                (() => {

                                                    if (q.questionKey === 'duration_of_stay') {

                                                        if (!hostQuestionsFailed.has(host.id)) {
                                                            return <SuccessCell value={hostTypeDisplay(host.type)} />;
                                                        }

                                                        const failedQuestionsForHost = hostQuestionsFailed.get(host.id) as Array<number>;
                                                        const isFailed = failedQuestionsForHost.indexOf(q.id) >= 0;

                                                        return isFailed
                                                            ? <FailCell value={hostTypeDisplay(host.type)} />
                                                            : <SuccessCell value={hostTypeDisplay(host.type)} />;

                                                    }

                                                    if (q.questionKey === 'hosting_amount') {

                                                        if (!hostQuestionsFailed.has(host.id)) {
                                                            return <SuccessCell value={host.hostingAmount.toString()} />;
                                                        }

                                                        const failedQuestionsForHost = hostQuestionsFailed.get(host.id) as Array<number>;
                                                        const isFailed = failedQuestionsForHost.indexOf(q.id) >= 0;

                                                        return isFailed
                                                            ? <FailCell value={host.hostingAmount.toString()} />
                                                            : <SuccessCell value={host.hostingAmount.toString()} />;

                                                    }


                                                    const response = data.hostResponses
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


                                                            if (!hostQuestionsFailed.has(host.id)) {
                                                                return <SuccessCell value={rv.text} />;
                                                            }


                                                            const failedQuestionsForHost = hostQuestionsFailed.get(host.id) as Array<number>;


                                                            const isFailed = failedQuestionsForHost.indexOf(q.id) >= 0;


                                                            return isFailed
                                                                ? <FailCell key={index} value={rv.text} />
                                                                : <SuccessCell key={index} value={rv.text} />;

                                                        })
                                                })()
                                            }
                                        </AdminGuestStyle.TableCell>
                                    );
                                })
                            }
                        </AdminGuestStyle.TableRow >
                            {
                                props.displayInterested && interestByHostId[host.id].interested === GuestInterestLevel.Interested
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


            </Paper>
        </AdminGuestStyle.AdminMatchHolders>

    );
}

export default MatchTable