import { Button, Container, Grid } from "@mui/material";
import * as React from "react";
import { ApplicationTrackerHeader } from ".";
import { useGuestDetails } from "../../data/GuestDetailsProvider";

interface ApplicationTrackerContentProps {}

export function ApplicationTrackerContainer(
  props: React.PropsWithChildren<ApplicationTrackerContentProps>
) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <header>
          <nav>
            <ApplicationTrackerHeader />
          </nav>
        </header>
      </Grid>
      <Grid item xs={12}>
        <main>{props.children}</main>
      </Grid>
    </Grid>
  );
}
