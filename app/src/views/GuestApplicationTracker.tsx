/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import {GuestDetailsProvider} from '../data/GuestDetailsProvider';

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
  action: GuestApplicationTrackerAction,
): GuestApplicationTrackerState {
  switch (action.type) {
    default:
      throw new Error(`Unsupported action: ${JSON.stringify(action)}`);
  }
}

export function GuestApplicationTracker(props: GuestApplicationTrackerProps) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  return (
    <>
      <GuestDetailsProvider>
        <h1>Guest application tracker</h1>
      </GuestDetailsProvider>
    </>
  );
}
