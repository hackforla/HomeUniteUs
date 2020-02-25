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
import { Grid, Container } from "@material-ui/core"

const useStyles = makeStyles(() => ({
  housePolicyContainer: {
    padding: "10px 20px",
    border: "1px hidden red",
    marginTop: "50px"
  },
  housePolicyTitle: {
    fontSize: "24px",
    border: "1px hidden green",
    fontWeight: "bold",
    margin: "0 0 25px 0"
  },
  housePolicies: {
    border: "1px hidden black",
    // width: "90%",
    // padding: "20px 0",
    display: "flex",
    flexWrap: "wrap"
  },
  policy: {
    border: "1px hidden blue",
    // width: "30%",
    margin: "20px 0",
    display: "flex",
    textAlign: 'center',
    flexDirection: "column",
    alignItems: "center"
  },
  icon: {},
  content: {
    fontSize: "24px"
    // paddingLeft: "10px"
  }
}))

interface IHousePoliciesProps {
  host: Host
}

export const HousePolicies = ({ host }: IHousePoliciesProps) => {
  const classes = useStyles()

  // let policies = [
  //   {
  //     icon: faPaw,
  //     content: host.petsText
  //   },
  //   {
  //     icon: faSmokingBan,
  //     content: host.smokingText
  //   },
  //   {
  //     icon: faWineBottle,
  //     content: host.drinkingText
  //   },
  //   {
  //     icon: faPrescriptionBottleAlt,
  //     content: host.substancesText
  //   }
  // ]


  let policies = [
    {
      icon: "/hosthome/img/pets.png",
      content: host.petsText
    },
    {
      icon: "/hosthome/img/smoke.png",
      content: host.smokingText
    },
    {
      icon: "/hosthome/img/alcohol.png",
      content: host.drinkingText
    },
    {
      icon: "/hosthome/img/meds.png",
      content: host.substancesText
    },
    {
      icon: "/hosthome/img/baby.png",
      content: "We welcome parents."
    }
  ]

  // if (host.youthParenting) {
  //   policies = policies.concat({
  //     icon: faBaby,
  //     content: "We welcome parents."
  //   })
  // }

  // if (host.youthRelationship) {
  //   policies = policies.concat({
  //     icon: faUserFriends,
  //     content: "We welcome youths in relationships."
  //   })
  // }

  return (
    <Container>
      <div className={classes.housePolicyContainer}>
        <div className={classes.housePolicyTitle}>House Policies</div>

        <Grid container alignContent='center' alignItems='center'>
          {
            policies.slice(0, 3).map(policy => {
              return (

                <Grid item xs alignContent='center' alignItems='center'>
                  <div className={classes.policy}>
                    <span className={classes.icon}>
                      {/* <FontAwesomeIcon
                        icon={policy.icon}
                        aria-hidden="true"
                        size="7x"
                      /> */}
                      <img width="100px" src={policy.icon} />
                    </span>
                    <p className={classes.content}>{policy.content}</p>
                  </div>
                </Grid>

              )
            })
          }
        </Grid>
        <Grid container alignContent='center' alignItems='center'>
          {
            policies.slice(3).map(policy => {
              return (

                <Grid item xs alignContent='center' alignItems='center'>
                  <div className={classes.policy}>
                    <span className={classes.icon}>
                      {/* <FontAwesomeIcon
                        icon={policy.icon}
                        aria-hidden="true"
                        size="7x"
                      /> */}
                      <img width="100px" src={policy.icon} />

                    </span>
                    <p className={classes.content}>{policy.content}</p>
                  </div>
                </Grid>

              )
            })
          }
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


    </Container>)
}

export default HousePolicies
