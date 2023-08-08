import React from 'react';
import {Typography, styled} from '@mui/material';

export const Home = () => {
  return (
    <HomeContainer>
      <Typography
        variant="h2"
        sx={{textAlign: 'center', fontSize: 32, fontWeight: 'normal'}}
      >
        Welcome to Home Unite Us
      </Typography>
    </HomeContainer>
  );
};

const HomeContainer = styled('section')({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  height: '100%',
  gap: '32px',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 16,
});
