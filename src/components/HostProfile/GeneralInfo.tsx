import * as React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import HostCard from './HostCard';
import LocationCard from './LocationCard';

const useStyles = makeStyles(() => ({
  generalInfoRow: {
    display: 'flex',
    justifyContent: 'space-around',
  }
}));

export const GeneralInfo = () => {
  const classes = useStyles();

  return (
    <div className={classes.generalInfoRow}>
      <HostCard />
      <LocationCard />
    </div>
  );
}

export default GeneralInfo;