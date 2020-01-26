import * as React from 'react';
import { Guest } from '../../models/Guest'
import { makeStyles } from "@material-ui/core/styles"
import GuestCard from './GuestCard'
import GuestInfo from './GuestInfo'
import ButtonBar from '../HostProfile/ButtonBar'

const useStyles = makeStyles(() => ({
    generalInfoRow: {
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center"
    },
}))

interface Props {
    guest: Guest
}

const GeneralInfo = ({ guest }: Props) => {

    const style = useStyles()

    return (
        <div>
            <div className={style.generalInfoRow}>
                <GuestCard guest={guest} />
                <GuestInfo guest={guest} />
            </div>
            <ButtonBar />
        </div>
    )
}

export default GeneralInfo