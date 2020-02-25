import * as React from "react"
import { Guest } from '../../models/Guest'
import { Grid } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"


interface Props {
    guest: Guest
}

const useStyles = makeStyles(() => ({
    policy: {
        border: "1px hidden blue",
        margin: "20px 0",
        display: "flex",
        textAlign: 'center',
        flexDirection: "column",
        alignItems: "center"
    },
    holder: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
    textWidth: { width: "285px", margin: "0 0 25px 0", fontSize: "24px" },
    image: { margin: "0 0 30px 0" }
}))


const GuestPolicies = ({ guest }: Props) => {
    const classes = useStyles()

    return (
        <div className={classes.policy}>
            <h5 style={{ fontSize: "24px", alignSelf: "flex-start", margin: "0 0 50px 25px" }}>{guest.firstName}'s Characteristics</h5>
            <Grid container alignContent='center' alignItems='center'>
                <Grid item xs alignContent='center' alignItems='center'>
                    <div className={classes.holder}>
                        <img src={"/hosthome/img/pets.png"} alt={"Pets Policy"} width={"100px"} className={classes.image} />
                        <span className={classes.textWidth}>{guest.petsText}</span>
                    </div>
                </Grid >
                <Grid item xs alignContent='center' alignItems='center'>
                    <div className={classes.holder}>
                        <img src={"/hosthome/img/smoke.png"} alt={"Smoke Policy"} width={"100px"} className={classes.image} />
                        <span className={classes.textWidth}>{guest.smokingText}</span>
                    </div>
                </Grid>
            </Grid >
            <Grid container alignContent='center' alignItems='center'>
                <Grid item xs alignContent='center' alignItems='center'>
                    <div className={classes.holder}>
                        <img src={"/hosthome/img/alcohol.png"} alt={"Alcohol Policy"} width={"100px"} className={classes.image} />
                        <span className={classes.textWidth}>{guest.drinkingText}</span>
                    </div>
                </Grid>
                <Grid item xs alignContent='center' alignItems='center'>
                    <div className={classes.holder}>
                        <img src={"/hosthome/img/meds.png"} alt={"Meds Policy"} width={"100px"} className={classes.image} />
                        <span className={classes.textWidth}>{guest.substancesText}</span>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}



export default GuestPolicies