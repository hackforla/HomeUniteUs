import * as React from 'react';
import { Guest } from '../../models/Guest'
import { makeStyles } from "@material-ui/core/styles"

interface Props {
    guest: Guest
}

const GuestCard = ({ guest }: Props) => {
    return (
        <p>guest!</p>
    )
}

export default GuestCard
