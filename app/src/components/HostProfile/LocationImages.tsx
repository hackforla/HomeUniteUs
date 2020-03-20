import * as React from "react"
import { LocationImagesStyle } from "./style"

const imageURLS = new Array(4).fill("/hosthome/img/house2.png")

const LocationImages = () =>
  <LocationImagesStyle.LocationImagesContainer>
    {imageURLS.map(imageURL =>
      <LocationImagesStyle.LocationImage src={imageURL} alt="location_image" />
    )}
  </LocationImagesStyle.LocationImagesContainer>

export default LocationImages
