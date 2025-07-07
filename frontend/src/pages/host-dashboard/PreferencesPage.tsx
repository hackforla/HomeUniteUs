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
  MenuItem,
  Select,
  InputLabel,
} from '@mui/material';
import {styled} from '@mui/system';
import {useNavigate} from 'react-router-dom';
import {useState} from 'react';

export function PreferencesPage() {
  const navigate = useNavigate();

  const [hostType, setHostType] = useState('');
  const [hostCapacity, setHostCapacity] = useState('');
  const [youthPet, setYouthPet] = useState('');
  const [petRestrictions, setPetRestrictions] = useState('');
  const [youthParent, setYouthParent] = useState('');
  const [coupleYouth, setCoupleYouth] = useState('');
  const [error, setError] = useState('');

  const handleNextClick = () => {
    if (!hostType) {
      setError(
        'Please select if you want to be a Full-Time Host or a Respite Host.',
      );
      return;
    }

    if (!hostCapacity) {
      setError('Please select how many youth you are able to host.');
      return;
    }

    if (!youthPet) {
      setError(
        'Please indicate if you are willing to host a youth with a pet.',
      );
      return;
    }

    if (youthPet === 'Yes' && !petRestrictions.trim()) {
      setError(
        'Please describe any restrictions you have around the type of pet.',
      );
      return;
    }

    if (!youthParent) {
      setError('Please indicate if you are willing to host a parenting youth.');
      return;
    }

    if (!coupleYouth) {
      setError(
        'Please indicate if you are willing to host youth in a relationship.',
      );
      return;
    }

    setError('');
    navigate('/host/overview');
  };

  const handlePreviousClick = () => {
    navigate('/host/motives');
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

        <Typography
          variant="h4"
          gutterBottom
          sx={{fontWeight: 'bold', color: 'black'}}
        >
          Preferences in a guest
        </Typography>

        <Typography variant="body1" paragraph>
          Please fill out the information below.
        </Typography>

        <Divider sx={{my: 3}} />

        <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
          {/* Host Type */}
          <FormControl component="fieldset">
            <FormLabel sx={{fontWeight: 'bold', color: 'black'}}>
              Are you interested in serving as a Full-Time Host (3-6 months) or
              a Respite Host (weekend- or week- long intervals)?
            </FormLabel>
            <RadioGroup
              value={hostType}
              onChange={e => setHostType(e.target.value)}
            >
              <FormControlLabel
                value="Full-Time Host"
                control={<Radio />}
                label="Full-Time Host"
              />
              <FormControlLabel
                value="Respite Host"
                control={<Radio />}
                label="Respite Host"
              />
            </RadioGroup>
          </FormControl>

          {/* Host Capacity */}
          <Typography sx={{fontWeight: 'bold', color: 'black'}}>
            How many youth are you able to host at one time?
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="guests-label">Select</InputLabel>
            <Select
              labelId="guests-label"
              value={hostCapacity}
              onChange={e => setHostCapacity(e.target.value)}
            >
              {[1, 2, 3, 4, 5].map(num => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Youths with Pets */}
          <FormControl component="fieldset">
            <FormLabel sx={{fontWeight: 'bold', color: 'black'}}>
              Are you willing to host a youth with a pet?
            </FormLabel>
            <RadioGroup
              value={youthPet}
              onChange={e => setYouthPet(e.target.value)}
            >
              <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="No" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>

          {youthPet === 'Yes' && (
            <Box>
              <Typography
                variant="body1"
                sx={{fontWeight: 'bold', color: 'black', mb: 1}}
              >
                If yes, are there any restrictions around the type of pet you
                can have in your home?
              </Typography>
              <TextField
                multiline
                minRows={3}
                fullWidth
                value={petRestrictions}
                onChange={e => setPetRestrictions(e.target.value)}
              />
            </Box>
          )}

          {/* Parenting Youth */}
          <FormControl component="fieldset">
            <FormLabel sx={{fontWeight: 'bold', color: 'black'}}>
              Are you willing to host a parenting youth?
            </FormLabel>
            <RadioGroup
              value={youthParent}
              onChange={e => setYouthParent(e.target.value)}
            >
              <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="No" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>

          {/* Youth in a relationship */}
          <FormControl component="fieldset">
            <FormLabel sx={{fontWeight: 'bold', color: 'black'}}>
              Are you willing to host youth who are in relationship with one
              another?
            </FormLabel>
            <RadioGroup
              value={coupleYouth}
              onChange={e => setCoupleYouth(e.target.value)}
            >
              <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="No" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Box>

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
