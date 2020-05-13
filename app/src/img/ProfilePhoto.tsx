import * as React from "react"
import { AppConfig } from "../data/config"

export interface ProfilePhotoProps {
  width: number
}

export const ProfilePhoto = function(props: ProfilePhotoProps) {
  return (
    <img src={AppConfig.DefaultProfileImageUrl} width={props.width} alt="Profile Photo" />
  )
}
