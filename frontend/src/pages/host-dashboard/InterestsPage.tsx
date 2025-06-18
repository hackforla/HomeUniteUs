/* eslint-disable */
import {Box, Typography, Divider, TextField, Button} from '@mui/material';
import {styled} from '@mui/system';
import {useNavigate} from 'react-router-dom';
import {useState} from 'react';

export function InterestsPage() {
  const navigate = useNavigate();

  const [hobbies, setHobbies] = useState('');
  const [error, setError] = useState('');

  const handleNextClick = () => {
    if (!hobbies.trim()) {
      setError('Please enter your hobbies.');
      return;
    }
    if (hobbies.length < 50) {
      setError('Please enter at least 50 characters.');
      return;
    }
    setError('');
    navigate('/host/overview');
  };

  const handlePreviousClick = () => {
    navigate('/host/employment');
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
          Interests and Hobbies
        </Typography>

        <Typography variant="body1" paragraph>
          Help us understand your goal and interests in participating the Home
          Unite Us Program.
        </Typography>

        <Divider sx={{my: 3}} />

        {/* Hobbies input */}

        <Typography variant="body1" paragraph sx={{fontWeight: 'bold'}}>
          Tell us about your passions, interests or hobbies.
        </Typography>
        <TextField
          placeholder="Share your thoughts..."
          multiline
          minRows={6}
          value={hobbies}
          onChange={e => setHobbies(e.target.value)}
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
