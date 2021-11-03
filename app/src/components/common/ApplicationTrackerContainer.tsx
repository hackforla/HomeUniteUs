import { Grid } from "@mui/material";
import * as React from "react";
import { ApplicationTrackerHeader } from ".";

interface ApplicationTrackerContentProps {}

export function ApplicationTrackerContainer(
  props: React.PropsWithChildren<ApplicationTrackerContentProps>
) {
  return (
    <Grid sx={{ minHeight: "100vh" }} container direction="column">
      <Grid item xs="auto">
        <ApplicationTrackerHeader />
      </Grid>
      <Grid
        component="main"
        sx={{ display: "flex", flexDirection: "column", flex: 1 }}
        item
        xs={12}
      >
        {props.children}
      </Grid>
    </Grid>
  );
}
