import React from 'react';
import {Typography} from '@mui/material';
import {styled} from '@mui/system';

import {HomeLink} from '../components/common/HomeLink';
import {HostIcon, CoordinatorIcon, GuestIcon} from '../components/Icons';
import {Header} from '../components/common';

export const Home = () => {
  return (
    <Header>
      <HomeContainer>
        <Typography
          variant="h1"
          sx={{textAlign: 'center', fontSize: 38, fontWeight: 500}}
        >
          Welcome to a Safe Place for Youth
        </Typography>
        <Typography variant="h2" sx={{textAlign: 'center', fontSize: 32}}>
          Select a profile
        </Typography>
        <LinkRow>
          <HomeLink to="/host" name="Host">
            <HostIcon />
          </HomeLink>
          <HomeLink to="/coordinator" name="Admin">
            <CoordinatorIcon />
          </HomeLink>
          <HomeLink to="/guest" name="Guest">
            <GuestIcon />
          </HomeLink>
        </LinkRow>
      </HomeContainer>
    </Header>
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

const LinkRow = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: '2rem',
});
