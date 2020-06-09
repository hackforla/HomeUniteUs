import React from 'react'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import { styles } from './style'
import { withStyles } from '@material-ui/core/styles'

interface Props {
    handleClose: () => void
    modalOpen: boolean
    classes: {
        modal: string
        paper: string
    }
    children: any
}

const MUIModal = (props: Props) => {
    const { handleClose, modalOpen, classes } = props

    return (
        <>
            <Modal
                className={classes.modal}
                open={modalOpen}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={modalOpen}>
                    <div className={classes.paper}>{props.children}</div>
                </Fade>
            </Modal>
        </>
    )
}

export default withStyles(styles)(MUIModal)
