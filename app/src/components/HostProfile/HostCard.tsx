import * as React from "react"
import HostRoomates from "./HostRoomates"
import { Host } from "../../models/Host"
import { HostCardStyle } from "./style"

interface IHostCardProps {
  host: Host
}

export const HostCard = ({ host }: IHostCardProps) => {
  const random = Math.floor(Math.random() * 4)

  return (
    <HostCardStyle.HostCardContainer>
      <HostCardStyle.HostImageContainer>
        <HostCardStyle.HostImage
          src={
            host.id === 999
              ? "/hosthome/img/bonnie.png"
              : host.id === 998
                ? "/hosthome/img/micheal.png"
                : `/hosthome/img/profile${random}.png`
          }
          alt="avatar"
        />
      </HostCardStyle.HostImageContainer>
      <HostCardStyle.HostDescriptionContainer>
        <HostRoomates roommates={host.householdMembers} />
      </HostCardStyle.HostDescriptionContainer>
    </HostCardStyle.HostCardContainer>
  )
}

export default HostCard
