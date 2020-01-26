import * as React from 'react';
import { Guest } from '../../models/Guest'
import { makeStyles } from "@material-ui/core/styles"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw, faSmokingBan, faWineBottle, faPrescriptionBottleAlt } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles(() => ({
    guestInfo: {
        width: "900px",
        height: "550px",
        borderRadius: "5px",
        boxShadow: "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "space-around",
        justifyContent: "space-around"

    },
    header: {
        width: "100%",
        textAlign: "center"
    },
    headerText: {
        fontSize: "24px",
        color: "rgba(0, 0, 0, 0.54)"
    },
    info: {
        width: "47%",
        height: "81%",
        display: "inherit",
        flexDirection: "column",
        justifyContent: "space-around",
        // alignItems: "center",
        color: "rgba(0, 0, 0, 0.54)"
    },
    spacer: {
        height: "19%",
        overflow: "scroll"
    }
}))

interface Props {
    guest: Guest
}

const Guest = ({ guest }: Props) => {

    const style = useStyles()

    return (
        <div className={style.guestInfo}>
            <div className={style.header}>
                <p className={style.headerText}>{guest.name}</p>
            </div>
            <div className={style.info}>
                <div className={style.spacer}>
                    <p>Introduction : {guest.guestIntro}</p>
                </div>
                <div className={style.spacer}>
                    <p>Email : {guest.email}</p>
                </div>
                <div className={style.spacer}>
                    <p>Date of Birth : {guest.dateOfBirth.toString()}</p>
                </div>
                <div className={style.spacer}>
                    <FontAwesomeIcon icon={faPaw} size="sm" />
                    <p>{guest.petsText}</p>
                </div>
                <div className={style.spacer}>
                    <FontAwesomeIcon icon={faWineBottle} size="sm" />
                    <p>{guest.drinkingText}</p>
                </div>
            </div>
            <div className={style.info}>
                <div className={style.spacer}>
                    <p>Statement : {guest.guestStayStatement}</p>
                </div>
                <div className={style.spacer}>
                    <p>Employment : {guest.employmentInfo}</p>
                </div>
                <div className={style.spacer}>
                    <p>Challenges : {guest.guestChallenges}</p>
                </div>
                <div className={style.spacer}>
                    <FontAwesomeIcon icon={faSmokingBan} size="sm" />
                    <p>{guest.smokingText}</p>
                </div>
                <div className={style.spacer}>
                    <FontAwesomeIcon icon={faPrescriptionBottleAlt} size="sm" />
                    <p>{guest.substancesText}</p>
                </div>
            </div>
        </div >
    )
}

export default Guest