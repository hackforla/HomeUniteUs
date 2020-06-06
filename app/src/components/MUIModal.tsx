import React from 'react'
import { makeStyles } from '@material-ui/core/styles'; //for modal
import Modal from '@material-ui/core/Modal'; //for modal
import Backdrop from '@material-ui/core/Backdrop'; //for modal
import Fade from '@material-ui/core/Fade'; //for modal

interface Props {
  handleClose(): any 
  modalOpen: boolean
}

//for modal
const useStyles = makeStyles((theme) => ({
  modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
  },
  paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
  },
})); //for modal

function WarningModal(props: Props) {
  const { handleClose, modalOpen } = props
  const classes = useStyles(); //for modal

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
            <h2 style={{ color: "red" }}>Warning</h2>
            <p>We're sorry this answer will disqualifies you from participating in this program.</p>
          </div>
        </Fade>
      </Modal>
    </>
  )
}

export default WarningModal
