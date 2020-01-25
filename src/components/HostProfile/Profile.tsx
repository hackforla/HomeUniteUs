import * as React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import GeneralInfo from './GeneralInfo';
import HousePolicies from './HousePolicies';
import HostAdditionalInfo from './HostAdditionalInfo';
import Neighborhood from './Neighborhood';
import ButtonBar from './ButtonBar';
import { useParams } from "react-router";
import { useHostHomeData } from "../../data/data-context";
import { Host } from "../../models";


const useStyles = makeStyles(() => ({
  profileContainer: {
    border: '1px hidden orange',
  },
}));

export const Profile = () => {
  const classes = useStyles();
  const { hostId } = useParams();
  const { data } = useHostHomeData();
  const host = data.hosts.find((host: Host) => host.id === parseInt(hostId || '-1')) as Host;

  return (
    <div className={classes.profileContainer}>
      <GeneralInfo host={host} />
      <HousePolicies host={host} />
      <HostAdditionalInfo host={host} />
      <Neighborhood />
      <ButtonBar />
    </div>
  );
}

export default Profile;