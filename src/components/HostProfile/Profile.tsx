import * as React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import GeneralInfo from './GeneralInfo';
import HousePolicies from './HousePolicies';
import HostAdditionalInfo from './HostAdditionalInfo';
import Neighborhood from './Neighborhood';
import ButtonBar from './ButtonBar';


const useStyles = makeStyles(() => ({
  profileContainer: {
    border: '1px hidden orange',
  },
}));

export const Profile = () => {
  const classes = useStyles();

  return (
    <div className={classes.profileContainer}>
      <GeneralInfo />
      <HousePolicies />
      <HostAdditionalInfo />
      <Neighborhood />
      <ButtonBar />
    </div>
  );
}

export default Profile;