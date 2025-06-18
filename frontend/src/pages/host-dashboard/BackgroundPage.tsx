/* eslint-disable */
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

export function BackgroundPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  // Step 1 state
  const [step1Answer, setStep1Answer] = useState('');
  const [step1Followup, setStep1Followup] = useState('');

  // Step 2 state - three main questions and their followups
  const [step2Answers, setStep2Answers] = useState([
    {answer: '', followup: ''},
    {answer: '', followup: ''},
    {answer: '', followup: ''},
  ]);

  const [error, setError] = useState('');

  const step2Questions = [
    {
      question: 'Do you smoke?',
      followupQuestion: 'Do you smoke in your house?',
    },
    {
      question: 'Do you drink alcohol?',
      followupQuestion: 'Do you have any concerns about your drinking?',
    },
    {
      question: 'Do you use any substances?',
      followupQuestion: 'Do you have any concerns about your substance use?',
    },
  ];

  // Handlers for step 2 answer change
  const handleStep2AnswerChange = (index: number, value: string) => {
    const updated = [...step2Answers];
    updated[index].answer = value;
    if (value === 'No') updated[index].followup = ''; // Clear follow-up if No
    setStep2Answers(updated);
  };

  // Handlers for step 2 followup change
  const handleStep2FollowupChange = (index: number, value: string) => {
    const updated = [...step2Answers];
    updated[index].followup = value;
    setStep2Answers(updated);
  };

  // Validation functions
  const validateStep1 = () => {
    if (!step1Answer) {
      setError('Please answer the question.');
      return false;
    }
    if (step1Answer === 'Yes' && !step1Followup.trim()) {
      setError('Please provide details for the follow-up question.');
      return false;
    }
    setError('');
    return true;
  };

  const validateStep2 = () => {
    for (let i = 0; i < step2Answers.length; i++) {
      const {answer, followup} = step2Answers[i];
      if (!answer) {
        setError(`Please answer question ${i + 1}.`);
        return false;
      }
      if (answer === 'Yes' && !followup) {
        setError(`Please answer the follow-up question for question ${i + 1}.`);
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleNextClick = () => {
    if (step === 1) {
      if (!validateStep1()) return;
      setStep(2);
    } else {
      if (!validateStep2()) return;
      navigate('/host/overview');
    }
  };

  const handlePreviousClick = () => {
    if (step === 2) setStep(1);
    else navigate('/host/references');
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
          Please fill out the information below.
        </Typography>

        <Typography variant="body1" paragraph></Typography>

        <Divider sx={{my: 3}} />

        {step === 1 && (
          <>
            <FormControl component="fieldset" sx={{mb: 3}}>
              <FormLabel
                component="legend"
                sx={{fontWeight: 'bold', color: 'black'}}
              >
                Are you bilingual or multilingual?
              </FormLabel>
              <RadioGroup
                value={step1Answer}
                onChange={e => setStep1Answer(e.target.value)}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>

            {step1Answer === 'Yes' && (
              <FormControl fullWidth sx={{mb: 3}}>
                <FormLabel sx={{fontWeight: 'bold', color: 'black', mb: 1}}>
                  If yes, what languages do you speak?
                </FormLabel>
                <TextField
                  multiline
                  minRows={3}
                  value={step1Followup}
                  onChange={e => setStep1Followup(e.target.value)}
                  fullWidth
                />
              </FormControl>
            )}
          </>
        )}

        {step === 2 && (
          <>
            {step2Questions.map(({question, followupQuestion}, idx) => (
              <Box key={idx} sx={{mb: 4}}>
                <FormControl component="fieldset" sx={{mb: 1}}>
                  <FormLabel
                    component="legend"
                    sx={{fontWeight: 'bold', color: 'black'}}
                  >
                    {question}
                  </FormLabel>
                  <RadioGroup
                    value={step2Answers[idx].answer}
                    onChange={e => handleStep2AnswerChange(idx, e.target.value)}
                    row
                  >
                    <FormControlLabel
                      value="Yes"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="No"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>

                {step2Answers[idx].answer === 'Yes' && (
                  <FormControl component="fieldset" sx={{ml: 4}}>
                    <FormLabel
                      component="legend"
                      sx={{fontWeight: 'bold', color: 'black'}}
                    >
                      {followupQuestion}
                    </FormLabel>
                    <RadioGroup
                      value={step2Answers[idx].followup}
                      onChange={e =>
                        handleStep2FollowupChange(idx, e.target.value)
                      }
                      row
                    >
                      <FormControlLabel
                        value="Yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                )}
              </Box>
            ))}
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
