import * as React from "react"
import { Container, Paper, Typography, makeStyles } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
  sidebarAboutBox: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[200]
  },
  sidebarSection: {
    marginTop: theme.spacing(3)
  }
}))

const firstParagraph =
  "Welcome to Hack for LA's host homes project! Hack for LA is a brigade of Code for America, and we're working with our partners at Safe Place for Youth (SPY) to enhance their host homes program. Together, we're developing a workflow management tool, digitizing key moments within SPY’s host homes initiative to make the process scaleable, reduce institutional bias, and effectively capture data."
const secondParagraph =
  "SPY’s host homes program is centered around housing young people, 18 - 25 years old. Their approach focuses on low-cost, community-driven intervention by matching a willing host with a guest or group of guests, providing a stable housing environment for youths who are experiencing homelessness and seeking stable housing."
const thirdParagraph =
  "We're currently seeking additional stakeholders who run similar host home/empty bedroom programs, to provide input and feedback on how this tool can and could be used. We're also seeking organizations and individuals interested in supporting the project financially."

export const AboutPage = () => {
  const classes = useStyles()
  return (
    <Container>
      <Paper elevation={0} className={classes.sidebarAboutBox}>
        <Typography variant="h2" gutterBottom align="center">
          About
        </Typography>
        <Typography>
          <h4>Introduction</h4>
          <p>{firstParagraph}</p>
          <h4>Overview</h4>
          <p>{secondParagraph}</p>
          <h4>Status</h4>
          <p>{thirdParagraph}</p>
          <p>
            If either of these applies to you, please contact Bonnie Wolfe, Hack
            for LA's Executive Director
            <a
              target="_blank"
              href="mailto:bonnie@hackforla.org?subject=Host Homes"
              style={{ color: "black", margin: "0 0 0 .5em" }}
            >
              bonnie@hackforla.org
            </a>
          </p>
        </Typography>
      </Paper>
    </Container>
  )
}
