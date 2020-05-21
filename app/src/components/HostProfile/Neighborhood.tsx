import * as React from 'react'
import { NeighborStyle } from './style'
import { Constants } from '../../data/config'

const Neighborhood = () => (
    <NeighborStyle.NeighborContainer>
        <NeighborStyle.NeighborTitle>
            The Neighborhood
        </NeighborStyle.NeighborTitle>
        <div className="neighborhood-map">
            <NeighborStyle.NeighborImage
                src={`${Constants.StaticFilePrefix}/img/neighborhoodImage.png`}
                alt="neighborhoodMap"
            />
        </div>
    </NeighborStyle.NeighborContainer>
)

export default Neighborhood
