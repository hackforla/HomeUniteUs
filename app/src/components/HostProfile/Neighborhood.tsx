import * as React from "react"
import { makeStyles } from "@material-ui/core/styles"
//import neighborhoodImage from '../../img/neighborhoodImage.png';

const useStyles = makeStyles(() => ({
  neighborhoodContainer: {
    padding: "10px 20px",
    border: "1px hidden blue",
    margin: "50px 0 200px 0"
  },
  neighborhoodTitle: {
    fontSize: "24px",
    border: "1px hidden blue"
  },
  neighborhoodMapImage: {
    width: "70%"
  }
}))

export const Neighborhood = () => {
  const classes = useStyles()

  return (
    <div className={classes.neighborhoodContainer}>
      <div className={classes.neighborhoodTitle}>The neighborhood</div>

      <div className="neighborhood-map">
        <img
          src="/hosthome/img/neighborhoodImage.png"
          alt="neighborhoodMap"
          className={classes.neighborhoodMapImage}
        />
      </div>
    </div>
  )
}

export default Neighborhood
