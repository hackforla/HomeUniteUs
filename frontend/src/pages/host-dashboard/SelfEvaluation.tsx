/* eslint-disable */
import {Box, Typography, Divider, TextField, Button} from '@mui/material';
import {styled} from '@mui/system';
import {useNavigate} from 'react-router-dom';
import {useState} from 'react';

export function SelfEvaluation() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [strengths, setStrengths] = useState('');
  const [challenges, setChallenges] = useState('');
  const [error, setError] = useState('');

  const validateInput = (value: string) => {
    if (!value.trim()) return 'This field is required.';
    if (value.trim().length < 50) return 'Please enter at least 50 characters.';
    return '';
  };

  const handleNextClick = () => {
    if (step === 1) {
      const validation = validateInput(strengths);
      if (validation) {
        setError(validation);
        return;
      }
      setError('');
      setStep(2);
    } else {
      const validation = validateInput(challenges);
      if (validation) {
        setError(validation);
        return;
      }
      setError('');
      navigate('/host/overview');
    }
  };

  const handlePreviousClick = () => {
    if (step === 2) {
      setStep(1);
      setError('');
    } else {
      navigate('/host/preferences');
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
          Strengths and Challenges
        </Typography>

        <Typography variant="body1" paragraph>
          Please fill out the information below.
        </Typography>

        <Divider sx={{my: 3}} />

        {/* Step 1: Strengths */}
        {step === 1 && (
          <>
            <Typography variant="body1" paragraph sx={{fontWeight: 'bold'}}>
              Please share any strengths, skills or experiences that you have
              that you believe will help make you a successful host.
            </Typography>
            <TextField
              placeholder="Share your thoughts..."
              multiline
              minRows={6}
              fullWidth
              value={strengths}
              onChange={e => setStrengths(e.target.value)}
              error={!!error}
              helperText={error}
            />
            <Typography variant="body1" paragraph sx={{color: 'grey'}}>
              Minimum 50 characters required
            </Typography>
          </>
        )}

        {/* Step 2: Challenges */}
        {step === 2 && (
          <>
            <Typography variant="body1" paragraph sx={{fontWeight: 'bold'}}>
              Please describe any challenges you foresee encountering in your
              role as Host.
            </Typography>
            <TextField
              placeholder="Share your thoughts..."
              multiline
              minRows={6}
              fullWidth
              value={challenges}
              onChange={e => setChallenges(e.target.value)}
              error={!!error}
              helperText={error}
            />
            <Typography variant="body1" paragraph sx={{color: 'grey'}}>
              Minimum 50 characters required
            </Typography>
          </>
        )}

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
