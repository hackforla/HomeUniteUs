import * as React from 'react';
import { Guest } from '../../models/Guest'
import { makeStyles } from "@material-ui/core/styles"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw, faSmokingBan, faWineBottle, faPrescriptionBottleAlt } from "@fortawesome/free-solid-svg-icons";
import { Grid } from '@material-ui/core';

const useStyles = makeStyles(() => ({
    guestInfo: {
        width: "900px",
        height: "400px",
        borderRadius: "5px",
        boxShadow: "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "space-around",
        justifyContent: "space-around",
        alignSelf: "flex-start",
        margin: ".7em 0 0 0",
        padding: "0 1em"

    },
    header: {
        width: "100%",
    },
    headerText: {
        fontSize: "24px",
        color: "rgba(0, 0, 0, 0.54)"
    },
    info: {
        width: "98%",
        height: "70%",
        display: "inherit",
        flexDirection: "column",
        justifyContent: "space-around",
        color: "rgba(0, 0, 0, 0.54)"
    },
    spacer: {
        height: "19%"
    },
    text: {
        fontSize: "1.4rem"
    },
    icon: {
        transform: "scale(1.8)",
        margin: "0 1.2em"
    },
}))

interface Props {
    guest: Guest
}

const Guest = ({ guest }: Props) => {

    const style = useStyles()

    return (
        <div className={style.guestInfo}>
            <div className={style.header}>
                <p className={style.headerText}>{guest.name}, {((new Date()).getFullYear() - guest.dateOfBirth.getFullYear())}</p>
            </div>


            {/* <div className={style.info}> */}
            {/* <div className={style.spacer}>
                    <p>Introduction : {guest.guestIntro}</p>
                </div>
                <div className={style.spacer}>
                    <p>Email : {guest.email}</p>
                </div>
                <div className={style.spacer}>
                    <p>Date of Birth : {guest.dateOfBirth.toString()}</p>
                </div> */}
            {/* <div className={style.spacer}>
                    <FontAwesomeIcon icon={faPaw} />
                    <p>{guest.petsText}</p>
                </div>
                <div className={style.spacer}>
                    <FontAwesomeIcon icon={faWineBottle} />
                    <p>{guest.drinkingText}</p>
                </div>
            </div> */}
            {/* <div className={style.info}> */}
            {/* <div className={style.spacer}>
                    <p>Statement : {guest.guestStayStatement}</p>
                </div>
                <div className={style.spacer}>
                    <p>Employment : {guest.employmentInfo}</p>
                </div>
                <div className={style.spacer}>
                    <p>Challenges : {guest.guestChallenges}</p>
                </div> */}
            {/* <div className={style.spacer}>
                    <FontAwesomeIcon icon={faSmokingBan} />
                    <p>{guest.smokingText}</p>
                </div>
                <div className={style.spacer}>
                    <FontAwesomeIcon icon={faPrescriptionBottleAlt} />
                    <p>{guest.substancesText}</p>
                </div>
            </div> */}
        </div>
    )
}

export default Guest