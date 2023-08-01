import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Typography, Button, Stack, Link, Divider} from '@mui/material';
import {styled} from '@mui/system';
import {HostIcon, CoordinatorIcon} from '../components/Icons';

export const Home = () => {
  const [type, setType] = useState(null);
  const navigateTo = useNavigate();

  const handleJoin = () => {
    navigateTo(`/signup/${type}`);
  };

  return (
    <HomeContainer>
      <Typography
        variant="h2"
        sx={{textAlign: 'center', fontSize: 32, fontWeight: 'normal'}}
      >
        Select your account type
      </Typography>
      <AccountStack>
        <AccountButton
          variant="outlined"
          size="large"
          name="coordinator"
          onClick={() => setType('coordinator')}
        >
          <CoordinatorIcon />
          <AccountLabel>Coordinator</AccountLabel>
        </AccountButton>
        <AccountButton
          variant="outlined"
          size="large"
          name="host"
          onClick={() => {
            setType('host');
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
        }}
        onClick={handleJoin}
      >
        {!type && <span>Select Account Type</span>}
        {type && <span>Join as {type}</span>}
      </Button>
      <Divider variant="middle" style={{width: '35%'}} />
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

const AccountButton = styled(Button)(({theme}) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '25%',
  padding: '2rem',
  borderColor: theme.palette.primary.dark,
  transition: 'border 0.6s',
  '&:hover': {
    // backgroundColor: theme.palette.primary[100],
    border: '3px solid',
    borderColor: theme.palette.primary.dark,
  },
  color: 'black',
}));
