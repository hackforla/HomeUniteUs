import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Typography, Button, Stack, Link, useTheme} from '@mui/material';
import {styled} from '@mui/system';
// import {HomeLink} from '../components/common/HomeLink';
import {HostIcon, CoordinatorIcon} from '../components/Icons';

export const Home = () => {
  const [type, setType] = useState(null);
  const navigateTo = useNavigate();
  const theme = useTheme();

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
        <Button
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '25%',
            padding: '2rem',
            '&:hover': {
              backgroundColor: theme.palette.primary[100],
            },
            '&:active': {
              backgroundColor: theme.palette.primary[300],
            },
            color: 'black',
          }}
          variant={type === 'coordinator' || null ? 'contained' : 'outlined'}
          size="large"
          name="coordinator"
          onClick={() => setType('coordinator')}
        >
          <CoordinatorIcon />
          <AccountLabel>Coordinator</AccountLabel>
        </Button>
        <Button
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '25%',
            padding: '2rem',
            '&:hover': {
              backgroundColor: theme.palette.primary[100],
            },
            color: 'black',
          }}
          variant={type === 'host' || null ? 'contained' : 'outlined'}
          size="large"
          name="host"
          onClick={() => {
            setType('host');
          }}
        >
          <HostIcon />
          <AccountLabel>Host</AccountLabel>
        </Button>
      </AccountStack>
      <Button
        variant="contained"
        disabled={!type}
        size="large"
        sx={{
          width: '35%',
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
  width: '90vw',
  height: '45%',
  justifyContent: 'center',
  alignItems: 'center',
});

const AccountLabel = styled('div')({
  display: 'flex',
  marginTop: '20px',
  marginBottom: '10px',
  height: '20px',
  fontSize: '1.4rem',
  fontWeight: 'bold',
});
