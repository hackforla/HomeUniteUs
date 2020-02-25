import * as React from 'react';
import { Guest } from '../../models/Guest'
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(() => ({
    guestCardContainer: {
        height: "400px",
        padding: "10px 20px",
        flexGrow: 1,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "flex-start"

    },
    guestImageContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    guestImage: {

        boxShadow: "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)"
    }
}))

interface Props {
    guest: Guest
}

const GuestCard = ({ guest }: Props) => {

    const style = useStyles()

    return (
        <div className={style.guestCardContainer}>
            <div className={style.guestImageContainer}>
                <img
                    className={style.guestImage}
                    src={guest.id === 999 ? "/hosthome/img/kirk.png" : "https://placebear.com/400/400"}
                    alt={"Guest Image"}
                    height="400px"
                />
            </div>
        </div>
    )
}

export default GuestCard
