import * as React from 'react'
import GeneralInfo from './GeneralInfo'
import HousePolicies from './HousePolicies'
import HostAdditionalInfo from './HostAdditionalInfo'
import Neighborhood from './Neighborhood'
import ButtonBar from './ButtonBar'
import { useParams } from 'react-router'
import { useHostHomeData } from '../../data/data-context'
import { Host } from '../../models'

export interface ProfileProps {
  isUnmatched: boolean
}

export const Profile = (props: ProfileProps) => {
  const { hostId } = useParams()
  const { data } = useHostHomeData()
  const host = data.hosts.find(
    (host: Host) => host.id === parseInt(hostId || '-1')
  ) as Host

  return (
    <React.Fragment>
      <GeneralInfo host={host} />
      <HousePolicies host={host} />
      <HostAdditionalInfo host={host} />
      <Neighborhood />
      {props.isUnmatched ? null : <ButtonBar />}
    </React.Fragment>
  )
}

export default Profile
