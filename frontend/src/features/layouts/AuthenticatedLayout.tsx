import React from 'react';
import {Stack, Toolbar, Box} from '@mui/material';
import {Outlet} from 'react-router-dom';
import {AuthenticatedHeader} from '../ui';

export const AuthenticatedLayout = () => {
  return (
    <Box sx={{display: 'flex'}}>
      <AuthenticatedHeader />
      <Stack
        component="main"
        sx={{
          minHeight: '100vh',
          width: '100vw',
        }}
      >
        <Toolbar />
        <Outlet />
      </Stack>
    </Box>
  );
};
