import { Container, Grid } from "@mui/material";
import * as React from "react";
import { ApplicationTrackerHeader } from "../components/common";
import { ApplicationTrackerContainer } from "../components/common/ApplicationTrackerContainer";
import { GuestDetailsProvider } from "../data/GuestDetailsProvider";

interface GuestApplicationTrackerProps {}

interface GuestApplicationTrackerState {}

enum GuestApplicationTrackerActionType {}

interface GuestApplicationTrackerAction {
  type: GuestApplicationTrackerActionType;
  payload?: string;
}

const initialState: GuestApplicationTrackerState = {};

function reducer(
  state: GuestApplicationTrackerState,
  action: GuestApplicationTrackerAction
): GuestApplicationTrackerState {
  switch (action.type) {
    default:
      throw new Error(`Unsupported action: ${JSON.stringify(action)}`);
  }
}

export function GuestApplicationTracker(props: GuestApplicationTrackerProps) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  console.log(`GuestApplicationTracker ctor`);
  return (
    <>
      <GuestDetailsProvider>
        <ApplicationTrackerContainer>
          <h1>Guest application tracker</h1>
        </ApplicationTrackerContainer>
      </GuestDetailsProvider>
    </>
  );
}