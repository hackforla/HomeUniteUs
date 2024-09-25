import React from 'react';
import {Stack, Toolbar, Box} from '@mui/material';
import {Outlet} from 'react-router-dom';
import {Header} from '../ui/Header';

export const AppLayout = () => {
  return (
    <Box sx={{display: 'flex'}}>
      <Header />
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
