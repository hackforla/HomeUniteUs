import React, { useRef } from 'react'
// import Box from '@material-ui/core/Box'
import UploadImageButton from './UploadImageButton'
import { Container, Typography, Box } from '@material-ui/core'

function ImageUploadComponent() {
    return (
        <Container maxWidth="lg">
            <Box display="flex" flexDirection="column" justifyContent="center">
                <div>
                    <Typography variant="h5">
                        Please Upload a Photo of your Home:
                    </Typography>
                </div>
                <div>
                    <UploadImageButton />
                </div>
            </Box>
        </Container>
    )
}

export default ImageUploadComponent
