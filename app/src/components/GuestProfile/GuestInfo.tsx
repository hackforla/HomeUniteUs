import * as React from "react"
import { GuestInfoStyle } from "./style"
import NumberContext from "./NumberContext"

export const GuestInfo = () => {

  const imageURLS = new Array(4).fill(
    `/hosthome/img/profileAdd${React.useContext(NumberContext)}.png`
  )

  return (
    <GuestInfoStyle.LocationImagesContainer>
      {imageURLS.map(imageURL =>
        <GuestInfoStyle.PlaceImage src={imageURL} alt="location_image" />
      )}
    </GuestInfoStyle.LocationImagesContainer>
  )
}

export default GuestInfo
