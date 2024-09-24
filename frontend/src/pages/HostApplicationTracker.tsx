/* eslint-disable @typescript-eslint/no-unused-vars */
import {Box, Typography} from '@mui/material';
import * as React from 'react';
import {AuthenticatedHeader} from '../features/common';

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
  return (
    <Box>
      <AuthenticatedHeader />
      <Typography variant="h6" sx={{paddingTop: '60px'}}>
        Host Application Tracker
      </Typography>
    </Box>
  );
}
