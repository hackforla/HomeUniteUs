import React, { useRef } from 'react'
// import Box from '@material-ui/core/Box'
import UploadImageButton from './UploadImageButton'
import { Container, Typography, Box } from '@material-ui/core'

function ImageUploadComponent() {
    return (
        <Container maxWidth="md">
            <Box
                border={3}
                borderColor="primary.main"
                borderRadius={16}
                display="flex"
                flexDirection="column"
                justifyContent="center"
            >
                <div>
                    <Typography variant="h4">
                        Please Upload a Photo of your Home
                    </Typography>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <UploadImageButton />
                </div>
            </Box>
        </Container>
    )
}

export default ImageUploadComponent
