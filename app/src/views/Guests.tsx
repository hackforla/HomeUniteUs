import {Box} from '@mui/material';
import React from 'react';
import {Outlet} from 'react-router-dom';
import {ApplicationTrackerHeader} from '../components/common';

export const Guests = () => {
  return (
    <Box
      style={{
        minHeight: '100vh',
        minWidth: '100vw',
        backgroundColor: 'coral',
      }}
    >
      <ApplicationTrackerHeader />
      <Outlet />
    </Box>
  );
};
