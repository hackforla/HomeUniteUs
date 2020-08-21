import * as React from 'react'
import HostCard from './HostCard'
import LocationCard from './LocationCard'
import { Host } from '../../models/Host'
import { HostHomeType } from '../../models/HostHomeType'
import { GeneralInfoStyle } from './style'

interface IGeneralInfoProps {
    host: Host
}

const hostTypeToString = (hostHomeType: HostHomeType) =>
    hostHomeType === HostHomeType.Respite
        ? 'respite'
        : hostHomeType === HostHomeType.Full
        ? 'full-time'
        : 'full-time or respite'

const GeneralInfo = ({ host }: IGeneralInfoProps) => (
    <React.Fragment>
        <React.Fragment>
            <GeneralInfoStyle.GeneralHeaderText>
                Meet {host.firstName}
            </GeneralInfoStyle.GeneralHeaderText>
            <GeneralInfoStyle.GeneralContent>
                {`${host.firstName} ${host.lastName}, ${
                    new Date().getFullYear() - host.dateOfBirth.getFullYear()
                }, is the ${hostTypeToString(
                    host.type
                )} host of a ${host.housingType.toLowerCase()} in ${
                    host.address
                }`}
            </GeneralInfoStyle.GeneralContent>
        </React.Fragment>
        <GeneralInfoStyle.GeneralInfoRow>
            <HostCard host={host} />
            <LocationCard host={host} />
        </GeneralInfoStyle.GeneralInfoRow>
    </React.Fragment>
)

export default GeneralInfo
