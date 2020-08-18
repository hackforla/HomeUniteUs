import React from 'react'
import MUIModal from '../MUIModal'
import { styles } from './styles'
import Button from '@material-ui/core/Button'
import { withStyles, WithStyles } from '@material-ui/core/'

interface ConfirmationModalProps extends WithStyles<typeof styles> {
  confirmationText: string
  modalOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmationModal(props: ConfirmationModalProps) {
  const { modalOpen, onConfirm, onCancel, confirmationText, classes } = props

  return (
    <MUIModal
      handleClose={onCancel}
      modalOpen={modalOpen}
      disableBackdropClick={true}
    >
      <h2 id="transition-modal-title">Confirmation Modal Example</h2>
      <p>{confirmationText}</p>
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={onConfirm}
      >
        Yes
      </Button>
      <Button
        variant="contained"
        color="secondary"
        className={classes.button}
        onClick={onCancel}
      >
        No
      </Button>
    </MUIModal>
  )
}

export default withStyles(styles)(ConfirmationModal)
