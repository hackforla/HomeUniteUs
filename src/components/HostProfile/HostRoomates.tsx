import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  roomatesContainer: {
    border: '1px hidden red',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    border: '1px hidden pink',
    fontSize: '24px',
    padding: '10px 0',
  },
  roomates: {
    border: '1px hidden blue',
    flexGrow: 1,
    paddingTop: '10px',
  },
  moreInfo: {
    border: '1px hidden green',
  },
}));

const roomates = [
  {
    name: "Bonnie Wolfe",
    age: "39",
    role: "host"
  },
  {
    name: "Dean Church",
    age: "40",
    role: "husband",
  },
  {
    name: "Audrey Church",
    age: "17",
    role: "daughter",
  }
]


const HostRoomates = () => {
  const classes = useStyles();

  return (
    <div className={classes.roomatesContainer}>
      <div className={classes.title}>
        The Roomates
      </div>

      <div className={classes.roomates}>
        {roomates.map(roomate => {
          return (
            <div>
              {roomate.name}, {roomate.age}, {roomate.role}
            </div>
          )
        })}
      </div>

      <div className={classes.moreInfo}>
        <a href="#">
          more about your host
        </a>
      </div>
    </div>
  );
}

export default HostRoomates;