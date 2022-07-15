import {Box, Stack} from '@mui/material';
import React from 'react';
import {Outlet} from 'react-router-dom';
import {ApplicationTrackerHeader} from '../components/common';

export const Guests = () => {
  return (
    <Stack
      sx={{
        minHeight: '100vh',
        minWidth: '100vw',
      }}
    >
      <Box>
        <ApplicationTrackerHeader />
      </Box>
      <Outlet />
    </Stack>
  );
};
