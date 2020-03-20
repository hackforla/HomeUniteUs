import * as React from "react"
import { NeighborStyle } from "./style"

const Neighborhood = () =>
  <NeighborStyle.NeighborContainer>
    <NeighborStyle.NeighborTitle>
      The Neighborhood
    </NeighborStyle.NeighborTitle>
    <div className="neighborhood-map">
      <NeighborStyle.NeighborImage
        src="/hosthome/img/neighborhoodImage.png"
        alt="neighborhoodMap"
      />
    </div>
  </NeighborStyle.NeighborContainer>

export default Neighborhood
