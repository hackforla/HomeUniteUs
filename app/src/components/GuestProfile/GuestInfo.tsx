import * as React from 'react'
import { GuestInfoStyle } from './style'
import NumberContext from './NumberContext'
import { Guest } from '../../models'
import { Constants } from '../../data/config'

interface GuestInfoProps {
    guest: Guest
}

export const GuestInfo = (props: GuestInfoProps) => {
    const imageURLS = new Array(4).fill(
        `${Constants.StaticFilePrefix}/img/profileAdd${React.useContext(
            NumberContext
        )}.png`
    )

    return (
        <GuestInfoStyle.LocationImagesContainer>
            {imageURLS.map((imageURL) => (
                <GuestInfoStyle.PlaceImage
                    src={imageURL}
                    alt="location_image"
                />
            ))}
        </GuestInfoStyle.LocationImagesContainer>
    )
}

export default GuestInfo
