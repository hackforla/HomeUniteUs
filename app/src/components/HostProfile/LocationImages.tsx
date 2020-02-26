import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  locationImagesContainer: {
    border: '1px hidden green',
    display: 'flex',
    flexWrap: 'wrap',
    height: '400px',
    minWidth: '600px',
    maxWidth: '800px',
  },
  image: {
    border: '1px hidden blue',
    width: '49%',
  },
}));

const imageURLS = [
  "/hosthome/img/house1.png",
  "/hosthome/img/house2.png",
  "/hosthome/img/house1.png",
  "/hosthome/img/house2.png",
]

export const LocationImages = () => {
  const classes = useStyles();

  return (
    <div className={classes.locationImagesContainer}>
      {imageURLS.map(imageURL => {
        return (
          <img
            src={imageURL}
            alt="location_image"
            className={classes.image}
          />
        )
      })}
    </div>
  );
}

export default LocationImages;