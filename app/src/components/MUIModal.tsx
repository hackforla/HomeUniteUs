import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

interface Props {
  handleClose: () => void
  modalOpen: boolean
  headerText: string
  text: string
}

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
}));

function MUIModal(props: Props) {
  const { handleClose, modalOpen, headerText, text } = props
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
            <h2 style={{ color: "red" }}>{headerText}</h2>
            <p>{text}</p>
          </div>
        </Fade>
      </Modal>
    </>
  )
}

export default MUIModal