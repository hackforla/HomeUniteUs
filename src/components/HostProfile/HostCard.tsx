import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import HostRoomates from './HostRoomates';
import { useParams } from "react-router";
import { useHostHomeData } from "../../data/data-context";
import { Host } from "../../models";

const useStyles = makeStyles(() => ({
  hostCardContainer: {
    border: '1px hidden purple',
    height: '600px',
    padding: '10px 20px',
    flexGrow: 1,

    display: 'flex',
    flexWrap: 'wrap',
  },
  hostImageContainer: {
    border: '1px hidden pink',
    width: '100%',
    height: '400px',

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  hostImage: {

    
  },
  hostDescriptionContainer: {
    border: '1px hidden blue',
    height: '175px',
    width: '100%',
  }
}));

export const HostCard = () => {
  const classes = useStyles();


  const {hostId} = useParams();

  const {data} = useHostHomeData();

  const host = data.hosts.find((host: Host) => host.id === parseInt(hostId || '-1')) as Host;

  return (
    <div className={classes.hostCardContainer}>
      <div className={classes.hostImageContainer}>
        <img
          className={classes.hostImage}
          src="https://www.fillmurray.com/400/400"
          alt="avatar"
        />
      </div>

      <div className={classes.hostDescriptionContainer}>
  <div>Name: {host.name}</div>
  <div>Address: {host.address}</div>
  <div>Employment Information: {host.employmentInfo}</div>
  <div>Email: {host.email}</div>
  <div>Phone: {host.phone}</div>
        <HostRoomates />
      </div>
    </div>
  );
}

export default HostCard;