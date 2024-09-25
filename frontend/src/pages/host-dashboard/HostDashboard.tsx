/* eslint-disable @typescript-eslint/no-unused-vars */
import {Box, Typography} from '@mui/material';
import * as React from 'react';
import {AuthenticatedHeader} from '../../features/common';

interface HostDashboardProps {}

interface HostDashboardState {}

enum HostDashboardActionType {}

interface HostDashboardAction {
  type: HostDashboardActionType;
  payload?: string;
}

const initialState: HostDashboardState = {};

function reducer(
  state: HostDashboardState,
  action: HostDashboardAction,
): HostDashboardState {
  switch (action.type) {
    default:
      throw new Error(`Unsupported action: ${JSON.stringify(action)}`);
  }
}

export function HostDashboard(props: HostDashboardProps) {
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
