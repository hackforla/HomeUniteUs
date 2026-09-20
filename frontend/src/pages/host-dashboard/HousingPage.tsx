/* eslint-disable */
import {
  Box,
  Typography,
  Divider,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  Checkbox,
  styled,
} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {useState} from 'react';

export function HousingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  // Step 1
  const [ownership, setOwnership] = useState('');
  const [housingType, setHousingType] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [homeState, setHomeState] = useState('');
  const [zipCode, setZipCode] = useState('');

  // Step 2
  const [insurance, setInsurance] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');

  // Step 3
  const [hasRooms, setHasRooms] = useState('');
  const [hasKitchen, setHasKitchen] = useState('');
  const [hasBathroom, setHasBathroom] = useState('');

  const handleNext = () => {
    if (step === 1) {
      if (!ownership) {
        setError('Please select an option for housing status.');
        return;
      }

      if (!housingType) {
        setError('Please select an option for type of housing.');
        return;
      }

      if (!streetAddress.trim()) {
        setError('Please provide the street address.');
        return;
      }

      if (!city.trim()) {
        setError('Please provide the city name.');
        return;
      }

      if (!homeState.trim()) {
        setError('Please provide the state.');
        return;
      }

      if (!zipCode.trim()) {
        setError('Please provide the zip code.');
        return;
      }
    }

    if (step === 2 && !insurance.trim()) {
      setError('Please select an option.');
      return;
    }
    if (step === 2 && insurance === 'yes' && !policyNumber.trim()) {
      setError('Please enter your policy number.');
      return;
    }

    if (step === 3) {
      if (!hasRooms) {
        setError('Please select an option for providing room/space.');
        return;
      }

      if (!hasKitchen) {
        setError('Please select an option for the access to the kitchen.');
        return;
      }

      if (!hasBathroom) {
        setError('Please select an option for the access to the bathroom.');
        return;
      }
    }

    setError('');
    if (step < 3) setStep(step + 1);
    else navigate('/host/overview');
  };

  const handlePrevious = () => {
    setError('');
    if (step > 1) setStep(step - 1);
    else navigate('/host/photos');
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
          Housing
        </Typography>

        <Typography variant="body1" paragraph>
          Please fill out the information below.
        </Typography>

        <Divider sx={{my: 3}} />

        {/* Step Sections */}

        {step === 1 && (
          <>
            <FormControl component="fieldset" fullWidth sx={{mb: 3}}>
              <FormLabel sx={{fontWeight: 'bold', color: 'black', mb: 1}}>
                Housing Status
              </FormLabel>
              <RadioGroup
                value={ownership}
                onChange={e => setOwnership(e.target.value)}
              >
                <FormControlLabel
                  value="Rented"
                  control={<Radio />}
                  label="Rented"
                />
                <FormControlLabel
                  value="Owned"
                  control={<Radio />}
                  label="Owned"
                />
              </RadioGroup>
            </FormControl>

            <FormControl component="fieldset" fullWidth sx={{mb: 3}}>
              <FormLabel sx={{fontWeight: 'bold', color: 'black', mb: 1}}>
                What type of housing?
              </FormLabel>
              <RadioGroup
                value={housingType}
                onChange={e => setHousingType(e.target.value)}
              >
                <FormControlLabel
                  value="Single Family House"
                  control={<Radio />}
                  label="Single Family House"
                />
                <FormControlLabel
                  value="Multi-Unit"
                  control={<Radio />}
                  label="Multi-Unit"
                />
                <FormControlLabel
                  value="Mobile Home"
                  control={<Radio />}
                  label="Mobile Home"
                />
                <FormControlLabel
                  value="Apartment"
                  control={<Radio />}
                  label="Apartment"
                />
              </RadioGroup>
            </FormControl>

            <FormControl fullWidth sx={{mb: 3}}>
              <FormLabel sx={{fontWeight: 'bold', color: 'black', mb: 1}}>
                Street Address
              </FormLabel>
              <TextField
                value={streetAddress}
                onChange={e => setStreetAddress(e.target.value)}
              />
            </FormControl>

            <FormControl fullWidth sx={{mb: 3}}>
              <FormLabel sx={{fontWeight: 'bold', color: 'black', mb: 1}}>
                City
              </FormLabel>
              <TextField value={city} onChange={e => setCity(e.target.value)} />
            </FormControl>

            <FormControl fullWidth sx={{mb: 3}}>
              <FormLabel sx={{fontWeight: 'bold', color: 'black', mb: 1}}>
                State
              </FormLabel>
              <TextField
                value={homeState}
                onChange={e => setHomeState(e.target.value)}
              />
            </FormControl>

            <FormControl fullWidth sx={{mb: 3}}>
              <FormLabel sx={{fontWeight: 'bold', color: 'black', mb: 1}}>
                Zip Code
              </FormLabel>
              <TextField
                value={zipCode}
                onChange={e => setZipCode(e.target.value)}
              />
            </FormControl>
          </>
        )}

        {step === 2 && (
          <>
            <FormControl sx={{mb: 3}}>
              <FormLabel sx={{color: 'black', fontWeight: 'bold', mb: 1}}>
                Do you have homeowner's/renters insurance?
              </FormLabel>
              <RadioGroup
                value={insurance}
                onChange={e => setInsurance(e.target.value)}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>

            {insurance === 'yes' && (
              <FormControl fullWidth sx={{mb: 3}}>
                <FormLabel sx={{color: 'black', fontWeight: 'bold', mb: 1}}>
                  If yes, what is the name and policy number of your carrier?
                </FormLabel>
                <TextField
                  fullWidth
                  value={policyNumber}
                  onChange={e => setPolicyNumber(e.target.value)}
                />
              </FormControl>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <FormControl component="fieldset" fullWidth sx={{mb: 3}}>
              <FormLabel sx={{fontWeight: 'bold', color: 'black', mb: 1}}>
                Are you able to provide a private room/extra space for a youth?
              </FormLabel>
              <RadioGroup
                value={hasRooms}
                onChange={e => setHasRooms(e.target.value)}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>

            <FormControl component="fieldset" fullWidth sx={{mb: 3}}>
              <FormLabel sx={{fontWeight: 'bold', color: 'black', mb: 1}}>
                Are you able to provide a youth access to a kitchen in which
                they can store food and prepare meals?
              </FormLabel>
              <RadioGroup
                value={hasKitchen}
                onChange={e => setHasKitchen(e.target.value)}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>

            <FormControl component="fieldset" fullWidth sx={{mb: 3}}>
              <FormLabel sx={{fontWeight: 'bold', color: 'black', mb: 1}}>
                Are you able to provide a youth access to a private or shared
                bathroom?
              </FormLabel>
              <RadioGroup
                value={hasBathroom}
                onChange={e => setHasBathroom(e.target.value)}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
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
            onClick={handlePrevious}
            sx={{color: 'black', borderColor: 'black'}}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
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

// Styled
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
