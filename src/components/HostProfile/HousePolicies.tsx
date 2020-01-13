import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw } from "@fortawesome/free-solid-svg-icons";
import { faSmokingBan } from "@fortawesome/free-solid-svg-icons";
import { faWineBottle } from "@fortawesome/free-solid-svg-icons";
import { faPrescriptionBottleAlt } from "@fortawesome/free-solid-svg-icons";
import { faBaby } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles(() => ({
  housePolicyContainer: {
    padding: '10px 20px',
    border: '1px hidden red',
    marginTop: '50px',
  },
  housePolicyTitle: {
    fontSize: '24px',
    border: '1px hidden green',
  },
  housePolicies: {
    border: '1px hidden black',
    width: '70%',
    padding: '20px 0',
    display: 'flex',
    flexWrap: 'wrap',
  },
  policy: {
    border: '1px hidden blue',
    width: '49%',
    margin: '20px 0',
  },
  icon: {

  },
  content: {
    paddingLeft: '10px',
  }
}));

const policies = [
  {
    icon: faPaw,
    content: "We are a pet free household."
  },
    {
    icon: faSmokingBan,
    content: "We provide a smoke-free environment."
  },
  {
    icon: faWineBottle,
    content: "People in this household drink alcohol."
  },
  {
    icon: faPrescriptionBottleAlt,
    content: "We use substances."
  },
  {
    icon: faBaby,
    content: "We welcome parents."
  },
]

export const HousePolicies = () => {
  const classes = useStyles();

  return (
    <div className={classes.housePolicyContainer}>

      <div className={classes.housePolicyTitle}>
        House Policy 
      </div>

      <div className={classes.housePolicies}>
        {policies.map(policy => {
          return (
            <div className={classes.policy}>
              <span className={classes.icon}>
                <FontAwesomeIcon
                  icon={policy.icon}
                  aria-hidden="true"
                  size="sm"
                />
              </span>
              <span className={classes.content}>{policy.content}</span>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default HousePolicies;