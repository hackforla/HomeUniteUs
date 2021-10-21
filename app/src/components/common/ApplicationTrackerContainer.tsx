import { Button, Container, Grid } from "@mui/material";
import * as React from "react";
import { ApplicationTrackerHeader } from ".";
import { useGuestDetails } from "../../data/GuestDetailsProvider";
import { AppContainer } from "./AppContainer";

interface ApplicationTrackerContentProps {}

export function ApplicationTrackerContainer(
  props: React.PropsWithChildren<ApplicationTrackerContentProps>
) {
  return (
    <Grid container direction="column">
      <Grid item xs="auto">
        <header>
          <nav>
            <ApplicationTrackerHeader />
          </nav>
        </header>
      </Grid>
      <AppContainer>
        <Grid item xs={12}>
          <main>{props.children}</main>
        </Grid>
      </AppContainer>
    </Grid>
  );
}
