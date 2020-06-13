import React from 'react'
import MUIModal from '../MUIModal'
import { styles } from './styles' //taking this out for now
import Button from '@material-ui/core/Button'
import { withStyles, WithStyles } from '@material-ui/core/'

// interface ConfirmationModalProps { //taking this out for now
interface ConfirmationModalProps extends WithStyles<typeof styles> {
    handleClose: () => void
    modalOpen: boolean
}

function ConfirmationModal(props: ConfirmationModalProps) {
    const { modalOpen, handleClose, classes } = props

    const onConfirm = () => {
        console.log('confirm then close')
        handleClose()
    }

    const onCancel = () => {
        handleClose()
    }

    return (
        <MUIModal handleClose={handleClose} modalOpen={modalOpen}>
            <h2 id="transition-modal-title" style={{ color: 'red' }}>
                Confirmation Modal
            </h2>
            <p>Confirmation text goes here!</p>
            <button onClick={onConfirm}>Yes</button>
            <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick={onCancel}
            >
                Delete
            </Button>
        </MUIModal>
    )
}

export default withStyles(styles)(ConfirmationModal)
