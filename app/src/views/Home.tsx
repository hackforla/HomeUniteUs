import React, {useState} from 'react';
import {Typography, Button, Stack, Link} from '@mui/material';
import {styled} from '@mui/system';
// import {HomeLink} from '../components/common/HomeLink';
import {HostIcon, CoordinatorIcon} from '../components/Icons';

export const Home = () => {
  const [label, setLabel] = useState(null);

  return (
    <HomeContainer>
      {/* <Typography
        variant="h1"
        sx={{textAlign: 'center', fontSize: 38, fontWeight: 500}}
      >
        Welcome to a Safe Place for Youth
      </Typography> */}
      <Typography
        variant="h2"
        sx={{textAlign: 'center', fontSize: 32, fontWeight: 'bold'}}
      >
        Select your account type
      </Typography>
      <AccountStack>
        <AccountButton
          variant="contained"
          size="large"
          to="/coordinator"
          name="Coordinator"
          onClick={() => {
            setLabel('coordinator');
          }}
        >
          <CoordinatorIcon />
          <AccountLabel>Coordinator</AccountLabel>
        </AccountButton>
        <AccountButton
          variant="contained"
          size="large"
          to="/host"
          name="Host"
          onClick={() => {
            setLabel('Host');
          }}
        >
          <HostIcon />
          <AccountLabel>Host</AccountLabel>
        </AccountButton>
      </AccountStack>
      <Button
        variant="contained"
        disabled={!label}
        size="large"
        sx={{width: '35%', marginTop: '1.5rem'}}
      >
        {!label && <span>Select Account Type</span>}
        {label && <span>Join as {label}</span>}
      </Button>
      <Stack direction="row" gap={1}>
        <Typography>Already have an account?</Typography>
        <Link fontWeight="bold" href="/signin">
          Sign in
        </Link>
      </Stack>
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

const AccountStack = styled('div')({
  display: 'flex',
  gap: '24px',
  height: '30%',
  width: '50%',
  justifyContent: 'space-between',
  minWidth: '700px',
  maxWidth: '670px',
  marginBottom: '1.2rem',
});

const AccountButton = styled('button')({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  maxWidth: '350px',
  minWidth: '250px',
  minHeight: '280px',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'white',
  borderColor: 'primary',
  borderRadius: '10px',
});

const AccountLabel = styled('div')({
  display: 'flex',
  marginTop: '20px',
  marginBottom: '10px',
  height: '20px',
  fontSize: '1.4rem',
  fontWeight: 'bold',
});
