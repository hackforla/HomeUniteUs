import React from 'react'
import MUIModal from '../MUIModal'

interface MessageModalProps {
    handleClose: () => void
    modalOpen: boolean
    modalHeadingText: string
    modalMessage: string
}

function MessageModal(props: MessageModalProps) {
    const { handleClose, modalOpen, modalHeadingText, modalMessage } = props
    return (
        <MUIModal handleClose={handleClose} modalOpen={modalOpen}>
            <h2 style={{ color: 'red' }}>{modalHeadingText}</h2>
            <p>{modalMessage}</p>
        </MUIModal>
    )
}

export default MessageModal
