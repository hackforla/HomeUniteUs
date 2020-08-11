import React, { useRef } from 'react'
import Box from '@material-ui/core/Box'
import UploadImageButton from './UploadImageButton'

function ImageUploadComponent() {
    return (
        <Box border={1}>
            <h1>Hello world</h1>
            <UploadImageButton />
        </Box>
    )
}

export default ImageUploadComponent
