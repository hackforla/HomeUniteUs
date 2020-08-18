import * as React from 'react'
import { LocationImagesStyle } from './style'
import { Constants } from '../../data/config'

const imageURLS = new Array(4).fill(
  `${Constants.StaticFilePrefix}/img/house2.png`
)

const LocationImages = () => (
  <LocationImagesStyle.LocationImagesContainer>
    {imageURLS.map((imageURL) => (
      <LocationImagesStyle.LocationImage src={imageURL} alt="location_image" />
    ))}
  </LocationImagesStyle.LocationImagesContainer>
)

export default LocationImages
