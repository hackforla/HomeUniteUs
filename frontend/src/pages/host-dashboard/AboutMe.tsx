/* eslint-disable */
import {Box, Typography, Divider, TextField, Button} from '@mui/material';
import {styled} from '@mui/system';
import {useNavigate} from 'react-router-dom';
import {useState} from 'react';

export function AboutMe() {
  const navigate = useNavigate();

  const [selfTalk, setSelfTalk] = useState('');
  const [error, setError] = useState('');

  const handleNextClick = () => {
    if (!selfTalk.trim()) {
      setError('This field is required.');
      return;
    }
    if (selfTalk.length < 50) {
      setError('Please enter at least 50 characters.');
      return;
    }
    setError('');
    navigate('/host/overview');
  };

  const handlePreviousClick = () => {
    navigate('/host/eval');
  };

  return (
    <PageContainer>
      <Header>
        <Typography
          variant="body2"
          sx={{cursor: 'pointer'}}
          onClick={() => navigate('/host/')}
        >
          &lt; Back to Dashboard
        </Typography>
      </Header>

      <ContentContainer>
        {/* Profile Overview Link */}
        <Typography
          variant="body2"
          sx={{
            cursor: 'pointer',
            color: 'primary.main',
            mb: 2,
            fontWeight: 500,
          }}
          onClick={() => navigate('/host/overview')}
        >
          &lt; My Profile Overview
        </Typography>

        {/* Heading */}
        <Typography variant="h4" gutterBottom sx={{fontWeight: 'bold'}}>
          About Me
        </Typography>

        <Typography variant="body1" paragraph>
          Please fill out the information below.
        </Typography>

        <Divider sx={{my: 3}} />

        <Typography variant="body1" paragraph sx={{fontWeight: 'bold'}}>
          All potential hosts will be asked to put together a profile of
          themselves, their family, and their home. Youth accepted into the Host
          Homes program will have the opportunity to review each host profile in
          order to decide with which hosts they would like to meet in person and
          explore potentially being matched.
        </Typography>
        <Typography variant="body1" paragraph sx={{fontWeight: 'bold'}}>
          As a way of starting your host profile, we ask that you take some time
          to write an introduction to yourself that you would feel excited to
          share with a potential guest. Feel free to talk about your passions,
          your family, the values that hold together your home, or anything else
          that feels important to you.
        </Typography>
        <TextField
          placeholder="Share your thoughts..."
          multiline
          minRows={6}
          value={selfTalk}
          onChange={e => setSelfTalk(e.target.value)}
          fullWidth
          error={!!error}
          helperText={error}
        />
        <Typography variant="body1" paragraph sx={{color: 'grey'}}>
          Minimum 50 characters required
        </Typography>

        <Divider sx={{my: 3}} />

        {/* Buttons */}
        <ButtonRow>
          <Button
            variant="outlined"
            onClick={handlePreviousClick}
            sx={{color: 'black', borderColor: 'black'}}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            onClick={handleNextClick}
            sx={{
              backgroundColor: 'black',
              color: 'white',
              '&:hover': {backgroundColor: '#333'},
            }}
          >
            Next
          </Button>
        </ButtonRow>
      </ContentContainer>
    </PageContainer>
  );
}

// Styled Components

const PageContainer = styled(Box)({
  backgroundColor: '#fafafa',
  minHeight: '100vh',
});

const Header = styled(Box)(({theme}) => ({
  padding: theme.spacing(2, 4),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const ContentContainer = styled(Box)(({theme}) => ({
  maxWidth: '50%',
  margin: '80px auto 0 auto',
  padding: theme.spacing(4),
  backgroundColor: '#fff',
  borderRadius: theme.spacing(2),
  textAlign: 'left',
}));

const ButtonRow = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
});
