import * as React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Host } from "../../models/Host"
import { Element } from "react-scroll"

const useStyles = makeStyles(() => ({
  additionalInfoContainer: {
    padding: "10px 20px",
    border: "1px hidden blue",
    marginTop: "50px"
  },
  additionalInfoTitle: {
    fontSize: "24px",
    border: "1px hidden blue"
  },
  additionalInfos: {
    width: "70%",
    border: "1px hidden orange"
  },
  additionalInfo: {
    border: "1px hidden orange",
    margin: "20px 0"
  },
  additionalInfoLabel: {
    fontWeight: "bold"
  },
  additionalInfoContent: {}
}))

interface IAdditionalInfoProps {
  host: Host
}

export const HostAdditionalInfo = ({ host }: IAdditionalInfoProps) => {
  const classes = useStyles()

  const additionalInfos = [
    {
      label: "Employment:",
      content: `I'm currently employed at ${host.employmentCompany} as ${host.employmentPosition}`
    },
    {
      label: "Languages Spoken:",
      content: host.languages.join(", ")
    },
    {
      label: "My Passions Are:",
      content: host.interests.join(", ")
    },
    {
      label: "Desired Characteristics In A Tenant:",
      content: host.preferredCharacteristics
    },
    {
      label: "I Would Like To Be A Host Home Because:",
      content: host.hostingInterest
    },
    {
      label: "I Think I Would Be A Good Host Because:",
      content: host.hostingStrengths
    },
    {
      label: "These Are Challenges I May Face As A Host:",
      content: host.hostingChallenges
    },
    {
      label: "More About Me:",
      content: host.hostIntro
    }
  ]

  return (
    <Element name="additionalInfo">
      <div className={classes.additionalInfoContainer}>
        <div className={classes.additionalInfoTitle}>About the Host</div>

        <div className={classes.additionalInfos}>
          {additionalInfos.map(additionalInfo => {
            return (
              <div className={classes.additionalInfo}>
                <div className={classes.additionalInfoLabel}>
                  {additionalInfo.label}
                </div>
                <div className={classes.additionalInfoContent}>
                  {additionalInfo.content}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Element>
  )
}

export default HostAdditionalInfo
