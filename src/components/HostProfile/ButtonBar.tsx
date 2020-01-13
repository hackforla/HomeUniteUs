import * as React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  appBar: {
    top: 'auto',
    bottom: 0,
    height: '50px',
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttons: {
    marginRight: "100px",
  },
  yesButton: {
    marginLeft: "20px",
  },
  extraSpace: {
    height: '50px',
  }
}));

export const ButtonBar = () => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <AppBar position="fixed" color="inherit" className={classes.appBar}>

        <div className={classes.buttons}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => console.log("I'm not interested")}
          >
            I'm not interested
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.yesButton}
            onClick={() =>console.log("I'm interested")}
          >
            I'm interested
          </Button>
        </div>
      </AppBar>
      <div className={classes.extraSpace}></div>
    </React.Fragment>
  );
}

export default ButtonBar;