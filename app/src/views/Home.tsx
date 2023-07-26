import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Typography, Button, Stack, Link} from '@mui/material';
import {styled} from '@mui/system';
// import {HomeLink} from '../components/common/HomeLink';
import {HostIcon, CoordinatorIcon} from '../components/Icons';

export const Home = () => {
  const [type, setType] = useState(null);
  const navigateTo = useNavigate();

  const handleJoin = () => {
    navigateTo(`/signup/${type}`);
  };

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
        sx={{textAlign: 'center', fontSize: 32, fontWeight: 'normal'}}
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
            setType('coordinator');
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
            setType('Host');
          }}
        >
          <HostIcon />
          <AccountLabel>Host</AccountLabel>
        </AccountButton>
      </AccountStack>
      <Button
        variant="contained"
        disabled={!type}
        size="large"
        sx={{
          width: '35%',
          marginTop: {xs: '0.8rem', sm: '1rem'},
        }}
        onClick={handleJoin}
      >
        {!type && <span>Select Account Type</span>}
        {type && <span>Join as {type}</span>}
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
  gap: '1.4rem',
  width: '80vw',
  justifyContent: 'center',
  marginBottom: '1.2rem',
});

const AccountButton = styled('button')({
  display: 'flex',
  flexDirection: 'column',
  width: '25%',
  height: '80%',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'white',
  borderColor: 'primary',
  borderRadius: '0.4rem',
  paddingTop: '1.5rem',
  paddingBottom: '1.5rem',
  minWidth: '200px',
  padding: '2rem',
});

const AccountLabel = styled('div')({
  display: 'flex',
  marginTop: '20px',
  marginBottom: '10px',
  height: '20px',
  fontSize: '1.4rem',
  fontWeight: 'bold',
});
