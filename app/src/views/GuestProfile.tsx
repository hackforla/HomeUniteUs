import React from 'react';
import {Container} from '@mui/material';
import {Link} from 'react-router-dom';

export const GuestProfile = () => {
  return (
    <Container>
      <h1>Guest profile View</h1>
      <Link to="application">To Application</Link>
    </Container>
  );
};
