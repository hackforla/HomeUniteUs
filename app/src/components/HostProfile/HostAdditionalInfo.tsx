import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Host } from '../../models/Host';
import { Element } from 'react-scroll'

const useStyles = makeStyles(() => ({
  additionalInfoContainer: {
    padding: '10px 20px',
    border: '1px hidden blue',
    marginTop: '50px',
  },
  additionalInfoTitle: {
    fontSize: '24px',
    border: '1px hidden blue',
  },
  additionalInfos: {
    width: '70%',
    border: '1px hidden orange',
  },
  additionalInfo: {
    border: '1px hidden orange',
    margin: '20px 0',
  },
  additionalInfoLabel: {
    fontWeight: 'bold'
  },
  additionalInfoContent: {

  },
}));

interface IAdditionalInfoProps {
  host: Host;
}

export const HostAdditionalInfo = ({
  host
}: IAdditionalInfoProps) => {
  const classes = useStyles();

  const additionalInfos = [
    {
      label: "Employment:",
      content: `I'm currently employed at ${host.employmentCompany} as ${host.employmentPosition}`
    },
    {
      label: "My passions are:",
      content: host.interests.join(", ")
    },
    {
      label: "Language(s) spoken:",
      content: host.languages.join(", ")
    },
    {
      label: "Additional preferences/desired characteristics:",
      content: host.preferredCharacteristics
    },
    {
      label: "I would like to be a host home because:",
      content: host.hostingInterest
    },
    {
      label: "I think I would be a good host because:",
      content: host.hostingStrengths
    },
    {
      label: "These are challenges I might face in being a good host:",
      content: host.hostingChallenges
    },
    {
      label: "More about me:",
      content: host.hostIntro
    }
  ]

  return (
  
    <Element name="additionalInfo">
      <div className={classes.additionalInfoContainer}>
        <div className={classes.additionalInfoTitle}>
          Additional Info
        </div>

        <div className={classes.additionalInfos}>
          {additionalInfos.map(additionalInfo => {

            return (
              <div className={classes.additionalInfo}>
                <div className={classes.additionalInfoLabel}>{additionalInfo.label}</div>
                <div className={classes.additionalInfoContent}>{additionalInfo.content}</div>
              </div>
            )
          })}
        </div>
      </div>
    </Element>
  );
}

export default HostAdditionalInfo;