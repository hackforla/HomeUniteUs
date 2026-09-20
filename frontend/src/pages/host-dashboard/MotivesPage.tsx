/* eslint-disable */
import {Box, Typography, Divider, TextField, Button} from '@mui/material';
import {styled} from '@mui/system';
import {useNavigate} from 'react-router-dom';
import {useState} from 'react';

export function MotivesPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [error, setError] = useState('');

  const validateCurrentStep = () => {
    const currentAnswer = step === 1 ? answer1.trim() : answer2.trim();

    if (!currentAnswer) {
      setError('This question is required.');
      return false;
    }
    if (currentAnswer.length < 50) {
      setError('Please provide at least 50 characters.');
      return false;
    }
    setError('');
    return true;
  };

  const handleNextClick = () => {
    if (!validateCurrentStep()) return;

    if (step === 1) {
      setStep(2);
    } else {
      navigate('/host/overview');
    }
  };

  const handlePreviousClick = () => {
    if (step === 2) {
      setStep(1);
      setError('');
    } else {
      navigate('/host/background');
    }
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

        <Typography variant="h4" gutterBottom sx={{fontWeight: 'bold'}}>
          Interest in Being a Host
        </Typography>

        <Typography variant="body1" paragraph>
          Please fill out the information below.
        </Typography>

        <Divider sx={{my: 3}} />

        {step === 1 && (
          <>
            <Typography
              variant="body1"
              paragraph
              sx={{fontWeight: 'bold', color: 'black'}}
            >
              Please describe any other additional characteristics you are
              hoping to find in a Guest you house.
            </Typography>
            <TextField
              multiline
              minRows={4}
              fullWidth
              value={answer1}
              onChange={e => setAnswer1(e.target.value)}
              placeholder="Share your thoughts..."
              sx={{mb: 3}}
            />
            <Typography variant="body1" paragraph sx={{color: 'grey'}}>
              Minimum 50 characters required
            </Typography>
          </>
        )}

        {step === 2 && (
          <>
            <Typography
              variant="body1"
              paragraph
              sx={{fontWeight: 'bold', color: 'black'}}
            >
              Please share why you are interested in hosting a young person
              experiencing homelessness in your home.
            </Typography>
            <TextField
              multiline
              minRows={4}
              fullWidth
              value={answer2}
              onChange={e => setAnswer2(e.target.value)}
              placeholder="Share your thoughts..."
              sx={{mb: 3}}
            />
            <Typography variant="body1" paragraph sx={{color: 'grey'}}>
              Minimum 50 characters required
            </Typography>
          </>
        )}

        <Divider sx={{my: 3}} />

        {error && (
          <Typography variant="body2" color="error" sx={{mb: 2}}>
            {error}
          </Typography>
        )}

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
              '&:hover': {
                backgroundColor: '#333',
              },
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
