/* eslint-disable */
import {
  Box,
  Typography,
  Divider,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  MenuItem,
  FormLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import {styled} from '@mui/system';
import {useNavigate} from 'react-router-dom';
import {useState} from 'react';
import CloseIcon from '@mui/icons-material/Close';

export function BasicInformation() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 1
  const [dob, setDob] = useState('');
  const [selectedOption, setSelectedOption] = useState('');

  // Step 2
  const [hasOccupants, setHasOccupants] = useState('');
  const [occupants, setOccupants] = useState([
    {name: '', relationship: '', dob: ''},
  ]);

  // Step 3
  const [questionOneAnswer, setQuestionOneAnswer] = useState('');
  const [checkboxOptions, setCheckboxOptions] = useState({
    optionA: false,
    optionB: false,
    other: false,
  });
  const [otherDescription, setOtherDescription] = useState('');

  // Step 4
  const [questionTwoAnswer, setQuestionTwoAnswer] = useState('');
  const [questionTwoDescription, setQuestionTwoDescription] = useState('');

  // Error & modal
  const [error, setError] = useState('');
  const [confirmRemoveIndex, setConfirmRemoveIndex] = useState<number | null>(
    null,
  );

  const handleNextClick = () => {
    if (step === 1) {
      if (!validateStep1()) return;
      setStep(2);
    } else if (step === 2) {
      if (!validateStep2()) return;
      setStep(3);
    } else if (step === 3) {
      if (!validateStep3()) return;
      setStep(4);
    } else if (step === 4) {
      if (!validateStep4()) return;
      navigate('/host/overview');
    }
  };

  const handlePreviousClick = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/host/contact');
    }
  };

  const validateStep1 = () => {
    const dobPattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
    if (!dob || !dobPattern.test(dob)) {
      setError('Please enter a valid date of birth in mm/dd/yyyy format.');
      return false;
    }
    if (!selectedOption) {
      setError('Please select an option for gender identity.');
      return false;
    }
    setError('');
    return true;
  };

  const validateStep2 = () => {
    if (!hasOccupants) {
      setError('Please select Yes or No.');
      return false;
    }

    if (hasOccupants === 'yes') {
      const dobPattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;

      for (let i = 0; i < occupants.length; i++) {
        const {name, relationship, dob} = occupants[i];
        const missingFields = [];

        if (!name.trim()) missingFields.push('name');
        if (!relationship.trim()) missingFields.push('relationship');
        if (!dob.trim()) {
          missingFields.push('date of birth');
        } else if (!dobPattern.test(dob)) {
          setError(
            `Occupant ${i + 1}: invalid date of birth. Use mm/dd/yyyy format.`,
          );
          return false;
        }

        if (missingFields.length > 0) {
          setError(`Occupant ${i + 1}: missing ${missingFields.join(', ')}.`);
          return false;
        }
      }
    }

    setError('');
    return true;
  };

  const validateStep3 = () => {
    if (!questionOneAnswer) {
      setError('Please select an option.');
      return false;
    }
    if (questionOneAnswer === 'yes') {
      const {optionA, optionB, other} = checkboxOptions;
      const hasInput = optionA || optionB || (other && otherDescription.trim());
      if (!hasInput) {
        setError('Please select at least one option or describe in Other.');
        return false;
      }
    }
    setError('');
    return true;
  };

  const validateStep4 = () => {
    if (!questionTwoAnswer) {
      setError('Please select an option.');
      return false;
    }
    if (questionTwoAnswer === 'yes' && !questionTwoDescription.trim()) {
      setError('Please describe your answer.');
      return false;
    }
    setError('');
    return true;
  };

  const handleOccupantChange = (
    index: number,
    field: keyof (typeof occupants)[0],
    value: string,
  ) => {
    const updated = [...occupants];
    updated[index] = {...updated[index], [field]: value};
    setOccupants(updated);
  };

  const addOccupant = () => {
    setOccupants([...occupants, {name: '', relationship: '', dob: ''}]);
  };

  const confirmRemoveOccupant = () => {
    if (confirmRemoveIndex !== null) {
      const updated = occupants.filter((_, i) => i !== confirmRemoveIndex);
      setOccupants(updated);
      setConfirmRemoveIndex(null);
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
          Basic Information
        </Typography>

        <Typography variant="body1" paragraph>
          Please tell us who you are
        </Typography>

        <Divider sx={{my: 3}} />

        {step === 1 && (
          <>
            <FormControl fullWidth sx={{mb: 3}}>
              <FormLabel sx={{color: 'black', fontWeight: 'bold', mb: 1}}>
                Date of Birth
              </FormLabel>
              <TextField
                value={dob}
                onChange={e => setDob(e.target.value)}
                placeholder="mm/dd/yyyy"
                fullWidth
              />
            </FormControl>

            <FormControl fullWidth sx={{mb: 3}}>
              <FormLabel sx={{color: 'black', fontWeight: 'bold', mb: 1}}>
                Gender Identity
              </FormLabel>
              <TextField
                select
                value={selectedOption}
                onChange={e => setSelectedOption(e.target.value)}
                fullWidth
                SelectProps={{
                  displayEmpty: true,
                  renderValue:
                    selectedOption !== ''
                      ? undefined
                      : () => (
                          <span style={{color: '#999'}}>I Identify as...</span>
                        ),
                }}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </TextField>
            </FormControl>
          </>
        )}

        {step === 2 && (
          <>
            <FormControl sx={{mb: 3}}>
              <FormLabel sx={{color: 'black', fontWeight: 'bold', mb: 1}}>
                Do any other adults or children live in your home beside you?
              </FormLabel>
              <RadioGroup
                value={hasOccupants}
                onChange={e => setHasOccupants(e.target.value)}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>

            {hasOccupants === 'yes' && (
              <>
                <Typography
                  variant="subtitle2"
                  sx={{mb: 2, fontWeight: 'bold'}}
                >
                  Please share some details about each individual living in your
                  home other than yourself:
                </Typography>
                {occupants.map((o, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      mb: 3,
                      p: 2,
                      border: '1px solid #ccc',
                      borderRadius: 2,
                      backgroundColor: '#f9f9f9',
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{mb: 2, fontWeight: 'bold'}}
                    >
                      Occupant {idx + 1}
                    </Typography>

                    {(['name', 'relationship', 'dob'] as const).map(field => (
                      <FormControl fullWidth sx={{mb: 2}} key={field}>
                        <FormLabel
                          sx={{color: 'black', fontWeight: 'bold', mb: 1}}
                        >
                          {field === 'dob'
                            ? 'Date of the Birth'
                            : field.charAt(0).toUpperCase() + field.slice(1)}
                        </FormLabel>
                        <TextField
                          value={o[field]}
                          placeholder={field === 'dob' ? 'mm/dd/yyyy' : ''}
                          onChange={e =>
                            handleOccupantChange(idx, field, e.target.value)
                          }
                          fullWidth
                        />
                      </FormControl>
                    ))}

                    <Button
                      variant="text"
                      color="error"
                      onClick={() => setConfirmRemoveIndex(idx)}
                      disabled={occupants.length === 1}
                    >
                      X Remove This Occupant
                    </Button>
                  </Box>
                ))}

                <Button
                  variant="text"
                  onClick={addOccupant}
                  sx={{color: 'primary.main', mb: 2}}
                >
                  + Add Another Occupant
                </Button>
              </>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <FormControl sx={{mb: 3}}>
              <FormLabel sx={{color: 'black', fontWeight: 'bold', mb: 1}}>
                Do you have any pets living with you?
              </FormLabel>
              <RadioGroup
                value={questionOneAnswer}
                onChange={e => setQuestionOneAnswer(e.target.value)}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>

            {questionOneAnswer === 'yes' && (
              <Box sx={{mb: 3}}>
                <Typography
                  variant="subtitle1"
                  sx={{mb: 2, fontWeight: 'bold'}}
                >
                  Which pets do you have in your home? Select all that apply.
                </Typography>
                <FormControl component="fieldset" variant="standard">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checkboxOptions.optionA}
                        onChange={e =>
                          setCheckboxOptions({
                            ...checkboxOptions,
                            optionA: e.target.checked,
                          })
                        }
                      />
                    }
                    label="Cat"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checkboxOptions.optionB}
                        onChange={e =>
                          setCheckboxOptions({
                            ...checkboxOptions,
                            optionB: e.target.checked,
                          })
                        }
                      />
                    }
                    label="Dog"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checkboxOptions.other}
                        onChange={e =>
                          setCheckboxOptions({
                            ...checkboxOptions,
                            other: e.target.checked,
                          })
                        }
                      />
                    }
                    label="Other. Please describe:"
                  />
                </FormControl>
                {checkboxOptions.other && (
                  <Box sx={{mt: 2}}>
                    <TextField
                      fullWidth
                      value={otherDescription}
                      onChange={e => setOtherDescription(e.target.value)}
                    />
                  </Box>
                )}
              </Box>
            )}
          </>
        )}

        {step === 4 && (
          <>
            <FormControl sx={{mb: 3}}>
              <FormLabel sx={{color: 'black', fontWeight: 'bold', mb: 1}}>
                Do you have any pet allergies?
              </FormLabel>
              <RadioGroup
                value={questionTwoAnswer}
                onChange={e => setQuestionTwoAnswer(e.target.value)}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>

            {questionTwoAnswer === 'yes' && (
              <FormControl fullWidth sx={{mb: 3}}>
                <FormLabel sx={{color: 'black', fontWeight: 'bold', mb: 1}}>
                  Please describe:{' '}
                </FormLabel>
                <TextField
                  fullWidth
                  value={questionTwoDescription}
                  onChange={e => setQuestionTwoDescription(e.target.value)}
                />
              </FormControl>
            )}
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

        <Dialog
          open={confirmRemoveIndex !== null}
          onClose={() => setConfirmRemoveIndex(null)}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              pt: 3,
              pb: 1,
              px: 3,
            }}
          >
            <Typography variant="h6" sx={{fontWeight: 'bold'}}>
              Are you sure you want to remove this occupant?
            </Typography>
            <IconButton
              onClick={() => setConfirmRemoveIndex(null)}
              size="small"
              sx={{mt: '-8px'}}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Divider sx={{my: 1}} />
          </DialogContent>
          <DialogActions sx={{justifyContent: 'space-between', px: 3, pb: 2}}>
            <Button
              onClick={() => setConfirmRemoveIndex(null)}
              variant="outlined"
              sx={{
                color: 'black',
                borderColor: 'black',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                  borderColor: '#333',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmRemoveOccupant}
              variant="contained"
              sx={{
                backgroundColor: 'black',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#333',
                },
              }}
            >
              I'm Sure
            </Button>
          </DialogActions>
        </Dialog>
      </ContentContainer>
    </PageContainer>
  );
}

// Styled components
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
  margin: '80px auto 40px',
  padding: theme.spacing(4),
  backgroundColor: '#fff',
  borderRadius: theme.spacing(2),
  textAlign: 'left',
}));

const ButtonRow = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
});
