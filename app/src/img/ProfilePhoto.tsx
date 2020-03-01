import * as React from "react"
import profilePlaceholder from "./profile-placeholder.png"

export interface ProfilePhotoProps {
  width: number
}

export const ProfilePhoto = function(props: ProfilePhotoProps) {
  return (
    <img src={profilePlaceholder} width={props.width} alt="Profile Photo" />
  )
}
