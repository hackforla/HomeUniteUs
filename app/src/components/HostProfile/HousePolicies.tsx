import * as React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaw } from "@fortawesome/free-solid-svg-icons"
import { faSmokingBan } from "@fortawesome/free-solid-svg-icons"
import { faWineBottle } from "@fortawesome/free-solid-svg-icons"
import { faPrescriptionBottleAlt } from "@fortawesome/free-solid-svg-icons"
import { faBaby } from "@fortawesome/free-solid-svg-icons"
import { faUserFriends } from "@fortawesome/free-solid-svg-icons"
import { Host } from "../../models/Host"
import { Grid } from "@material-ui/core"

const useStyles = makeStyles(() => ({
  housePolicyContainer: {
    padding: "10px 20px",
    border: "1px hidden red",
    marginTop: "50px"
  },
  housePolicyTitle: {
    fontSize: "24px",
    border: "1px hidden green"
  },
  housePolicies: {
    border: "1px hidden black",
    width: "90%",
    padding: "20px 0",
    display: "flex",
    flexWrap: "wrap"
  },
  policy: {
    border: "1px hidden blue",
    width: "30%",
    margin: "20px 0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  icon: {},
  content: {
    paddingLeft: "10px"
  }
}))

interface IHousePoliciesProps {
  host: Host
}

export const HousePolicies = ({ host }: IHousePoliciesProps) => {
  const classes = useStyles()

  let policies = [
    {
      icon: faPaw,
      content: host.petsText
    },
    {
      icon: faSmokingBan,
      content: host.smokingText
    },
    {
      icon: faWineBottle,
      content: host.drinkingText
    },
    {
      icon: faPrescriptionBottleAlt,
      content: host.substancesText
    }
  ]

  if (host.youthParenting) {
    policies = policies.concat({
      icon: faBaby,
      content: "We welcome parents."
    })
  }

  if (host.youthRelationship) {
    policies = policies.concat({
      icon: faUserFriends,
      content: "We welcome youths in relationships."
    })
  }

  return (
    <div className={classes.housePolicyContainer}>
      <div className={classes.housePolicyTitle}>House Policy</div>

      <Grid container>
        {policies.map(policy => {
          return (

            <Grid item xs={4}>
            <div className={classes.policy}>
              <span className={classes.icon}>
                <FontAwesomeIcon
                  icon={policy.icon}
                  aria-hidden="true"
                  size="7x"
                />
              </span>
              <p className={classes.content}>{policy.content}</p>
            </div>
            </Grid>

          )
        })}
      </Grid>
      {/* <div className={classes.housePolicies}>
        {policies.map(policy => {
          return (
            <div className={classes.policy}>
              <span className={classes.icon}>
                <FontAwesomeIcon
                  icon={policy.icon}
                  aria-hidden="true"
                  size="7x"
                />
              </span>
              <p className={classes.content}>{policy.content}</p>
            </div>
          )
        })}
      </div> */}
    </div>
  )
}

export default HousePolicies
