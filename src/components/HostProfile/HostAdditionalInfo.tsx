import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";

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

const additionalInfos = [
  {
    label: "Employment:",
    content: "I'm currently employed at Hack For LA as Executive Director",
  },
  {
    label: "My passions are:",
    content: "Salsa Dancing, Extreme Volunteering",
  },
  {
    label: "Language(s) spoken:",
    content: "English",
  },
  {
    label: "Additional preferences/desired characteristics:",
    content: "I prefer someone who is in school or working most of the time.",
  },
  {
    label: "I would like to be a host home because:",
    content: "I would like to provide a platform from where it is easier to make healthy choices."
  },
  {
    label: "I think I would be a good host because:",
    content: "I experienced homelessness from 16-20 and I made many difficult choices because of my circumstances.So I understand the path forward is not always linear."
  },
  {
    label: "These are challenges I might face in being a good host:",
    content: "I have been accused of caring too much and I tend to roll up my sleeves and jump in solving problems..experience, and while it can be helpful for others when I share it.  No one can design your life or your experiences for you, you must own those choices yourself informed by the information you seek out and process."
  },
  {
    label: "More about me:",
    content: "I do not take time off.  I don't believe in work in the traditional way.  I find things I am passionate about and they become my life.  That might be starting a tech company, learning a new skill, running a non profit, or helping friends and loved ones.  It has resulted in a life that is full of wonderful challenges and people, where I can't ever imagine retiring.   When I was young, my mother isolated me from family in an unsafe environment. This caused me to become very self reliant.  But I really like connecting with people and subscribe to the idea that life is a team sport.  We do everything better when we find people to do them with, a community that helps each other when we need to, encourages us to learn from our collective mistakes, and celebrates our wins as if they were their own."
  }
]

export const HostAdditionalInfo = () => {
  const classes = useStyles();

  return (
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
  );
}

export default HostAdditionalInfo;