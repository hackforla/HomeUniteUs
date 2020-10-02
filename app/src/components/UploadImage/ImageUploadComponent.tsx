import React, { useRef } from 'react'
import UploadImageButton from './UploadImageButton'
import { Container, Typography, Box } from '@material-ui/core'
import { Photo } from '../../models/v2'
import { useHostDashboardData } from '../../data/host-context'
import { useAuth0, Auth0User } from '../../react-auth0-spa'

interface ImageUploadComponentProps {
    uploadAll?: (images: Array<File>) => void
    images?: Array<Photo>
    heading?: string
}

function ImageUploadComponent(props: ImageUploadComponentProps) {
    const { user } = useAuth0()

    const {
        putSinglePictureInfo,
        putMultiplePictureInfo,
    } = useHostDashboardData()

    const handleSubmit = (images: Array<File>) => {
        const email = (user as Auth0User).email
        try {
            images.forEach((image: File) => {
                putSinglePictureInfo(image, email, 'home')
                // putMultiplePictureInfo(images, email, 'home')
            })
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <Container maxWidth="lg">
            <Box display="flex" flexDirection="column" justifyContent="center">
                <div>
                    <Typography variant="h5">
                        {props.heading || 'Please upload photo:'}
                    </Typography>
                </div>
                <div>
                    <UploadImageButton
                        // uploadAll={props.uploadAll}
                        uploadAll={handleSubmit}
                        images={props.images}
                    />
                </div>
            </Box>
        </Container>
    )
}

export default ImageUploadComponent
