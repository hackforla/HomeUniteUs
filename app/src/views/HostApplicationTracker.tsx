/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';

interface HostApplicationTrackerProps {}

interface HostApplicationTrackerState {}

enum HostApplicationTrackerActionType {}

interface HostApplicationTrackerAction {
  type: HostApplicationTrackerActionType;
  payload?: string;
}

const initialState: HostApplicationTrackerState = {};

function reducer(
  state: HostApplicationTrackerState,
  action: HostApplicationTrackerAction,
): HostApplicationTrackerState {
  switch (action.type) {
    default:
      throw new Error(`Unsupported action: ${JSON.stringify(action)}`);
  }
}

export function HostApplicationTracker(props: HostApplicationTrackerProps) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  return <h1>Host application tracker</h1>;
}
