import React from 'react'
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { useStyles } from './style'

function MUIModal(props: any) {
  const { handleClose, modalOpen } = props
  const classes = useStyles();

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
          <div className={classes.paper}>
            {props.children}
          </div>
        </Fade>
      </Modal>
    </>
  )
}

export default MUIModal