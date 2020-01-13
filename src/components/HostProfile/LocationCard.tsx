import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import LocationImages from './LocationImages';

const useStyles = makeStyles(() => ({
  locationCardContainer: {
    border: '1px hidden green',
    height: '600px',
    padding: '10px 20px',
    flexGrow: 1,

    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'stretch',
  },
  locationDescriptionContainer: {
    border: '1px hidden blue',
    width: '100%',
    height: '166px',
  },
  locationInfo: {
    border: '1px hidden blue',
    fontSize: '24px',
    padding: '10px 0',
  },
  visitorInfo: {
    border: '1px hidden red',
  }
}));

export const LocationCard = () => {
  const classes = useStyles();

  return (
    <div className={classes.locationCardContainer}>
      <LocationImages />

      <div className={classes.locationDescriptionContainer}>
        <div className={classes.locationInfo}>
          Respite | Playa Vista
        </div>

        <div className={classes.visitorInfo}>
          Our rented multi-unit home can host 1 visitor.
        </div>
      </div>
    </div>
  );
}

export default LocationCard;