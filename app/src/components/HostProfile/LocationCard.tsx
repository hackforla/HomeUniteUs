import * as React from 'react'
import LocationImages from './LocationImages'
import { Host } from '../../models'
import { LocationCardStyle } from './style'

interface ILocationCardProps {
    host: Host
}

const LocationCard = ({ host }: ILocationCardProps) => (
    <LocationCardStyle.LocationCardContainer>
        <LocationCardStyle.LocationInfoContainer>
            <LocationImages />
        </LocationCardStyle.LocationInfoContainer>
        <LocationCardStyle.LocationInfoContainer>
            <LocationCardStyle.LocationDescriptionContainer>
                <LocationCardStyle.LocationInfo>
                    {host.housingType} | {host.address}
                </LocationCardStyle.LocationInfo>
                <React.Fragment>
                    {`Our ${host.housingType.toLowerCase()} can host ${
                        host.hostingAmount
                    } ${host.hostingAmount > 1 ? 'visitors' : 'visitor'}`}
                </React.Fragment>
            </LocationCardStyle.LocationDescriptionContainer>
        </LocationCardStyle.LocationInfoContainer>
    </LocationCardStyle.LocationCardContainer>
)

export default LocationCard
