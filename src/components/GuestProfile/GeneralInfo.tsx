import * as React from 'react';
import { Guest } from '../../models/Guest'
import { makeStyles } from "@material-ui/core/styles"
import GuestCard from './GuestCard'

const useStyles = makeStyles(() => ({
    generalInfoRow: {
        display: "flex",
        justifyContent: "space-around"
    },
}))

interface Props {
    guest: Guest
}

const GeneralInfo = ({ guest }: Props) => {

    const style = useStyles()

    return (
        <div className={style.generalInfoRow}>
            <GuestCard guest={guest} />
        </div>
    )
}

export default GeneralInfo