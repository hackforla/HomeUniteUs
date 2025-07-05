/* eslint-disable */
import axios from 'axios';

import {
  Box,
  Typography,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Button,
} from '@mui/material';
import {styled} from '@mui/system';
import {useNavigate} from 'react-router-dom';
import {useState} from 'react';

export function ContactPage() {
  const navigate = useNavigate();

  // Form state
  const [selectedOption, setSelectedOption] = useState('');
  const [numericInput, setNumericInput] = useState('');
  const [error, setError] = useState('');

  // Handlers
  const handleNextClick = async () => {
    if (!selectedOption) {
      setError('Please select an option for method of contact.');
      return;
    }
    if (
      !numericInput ||
      !/^\d+$/.test(numericInput) ||
      numericInput.length < 10
    ) {
      setError('Please enter a valid numeric value with at least 10 digits.');
      return;
    }

    setError(''); // Clear any existing errors before sending

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user?.id ?? 1;

      await axios.post('/api/host-dashboard/contact-info', {
        preferred_method: selectedOption,
        phone_number: numericInput,
        user_id: userId,
      });

      // If POST succeeds, navigate:
      navigate('/host/overview');
    } catch (err) {
      console.error(err);
      setError('Something went wrong while saving your info.');
    }
  };

  const handlePreviousClick = () => {
    navigate('/host/welcome');
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
          Contact Information
        </Typography>

        <Typography variant="body1" paragraph>
          How can we reach out to you?
        </Typography>

        <Divider sx={{my: 3}} />

        {/* Question 1 - Radio buttons */}
        <FormControl component="fieldset" sx={{mb: 3}}>
          <FormLabel
            component="legend"
            sx={{color: 'black', fontWeight: 'bold'}}
          >
            Which method of contact do you prefer?
          </FormLabel>
          <RadioGroup
            value={selectedOption}
            onChange={e => setSelectedOption(e.target.value)}
          >
            <FormControlLabel value="Email" control={<Radio />} label="Email" />
            <FormControlLabel value="Text" control={<Radio />} label="Text" />
          </RadioGroup>
        </FormControl>

        {/* Question 2 - Numeric input */}
        <FormLabel component="legend" sx={{color: 'black', fontWeight: 'bold'}}>
          Phone Number
        </FormLabel>
        <TextField
          value={numericInput}
          onChange={e => {
            const value = e.target.value;
            // Allow only digits
            if (/^\d*$/.test(value)) {
              setNumericInput(value);
            }
          }}
          fullWidth
          sx={{mb: 3}}
        />

        <Divider sx={{my: 3}} />

        {/* Error message */}
        {error && (
          <Typography variant="body2" color="error" sx={{mb: 2}}>
            {error}
          </Typography>
        )}

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
