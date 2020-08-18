import React from 'react'
import MUIModal from '../MUIModal'

interface MessageModalProps {
  modalOpen: boolean
  modalHeadingText: string
  modalMessage: string
  onCancel: () => void
}

function MessageModal(props: MessageModalProps) {
  const { onCancel, modalOpen, modalHeadingText, modalMessage } = props
  return (
    <MUIModal
      handleClose={onCancel}
      modalOpen={modalOpen}
      disableBackdropClick={false}
    >
      <h2 style={{ color: 'red' }}>{modalHeadingText}</h2>
      <p>{modalMessage}</p>
    </MUIModal>
  )
}

export default MessageModal
