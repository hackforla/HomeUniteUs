import * as React from 'react';
import {
  Button,
  Container,
  Divider,
  Stack,
  Box,
  Typography,
  OutlinedInput,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {Route, Routes, useNavigate, useParams} from 'react-router-dom';
import {useFormik} from 'formik';

interface FormProps {
  handleChange: (e: React.ChangeEvent<unknown>) => void;
  value: string;
  touched: boolean | undefined;
  error: string | undefined;
}

const NameForm = ({handleChange, value, touched, error}: FormProps) => {
  return (
    <Stack sx={{flexGrow: 1, gap: 1, maxWidth: '600px'}}>
      <Typography variant="h5">What is your name?</Typography>
      <OutlinedInput
        fullWidth
        id="name"
        name="name"
        value={value}
        onChange={handleChange}
        error={touched && Boolean(error)}
      />
    </Stack>
  );
};

const AddressForm = ({handleChange, value, touched, error}: FormProps) => {
  return (
    <Stack sx={{flexGrow: 1, gap: 1, maxWidth: '600px'}}>
      <Typography variant="h5">What is your address?</Typography>
      <OutlinedInput
        fullWidth
        id="address"
        name="address"
        value={value}
        onChange={handleChange}
        error={touched && Boolean(error)}
      />
    </Stack>
  );
};

const PhoneForm = ({handleChange, value, touched, error}: FormProps) => {
  return (
    <Stack sx={{flexGrow: 1, gap: 1, maxWidth: '600px'}}>
      <Typography variant="h5">What is your phone number?</Typography>
      <OutlinedInput
        fullWidth
        id="phone"
        name="phone"
        value={value}
        onChange={handleChange}
        error={touched && Boolean(error)}
      />
    </Stack>
  );
};

const routes = ['name', 'address', 'phone'];

export const GuestApplicationTracker = () => {
  const params = useParams();
  // use url params to set initial state for step incase of refresh
  const [step, setStep] = React.useState(
    () => routes.indexOf(params['*'] || '') || 0,
  );
  const navigate = useNavigate();
  const {handleSubmit, handleChange, values, touched, errors} = useFormik({
    initialValues: {
      name: '',
      address: '',
      phone: '',
    },
    onSubmit: values => {
      console.log(values);
    },
  });

  const handleNextStep = () => {
    // increment step as long as it's not the last step
    if (step < routes.length - 1) {
      setStep(step + 1);
      navigate(`${routes[step + 1]}`);
    }
  };

  const handleGoBack = () => {
    // decrement step as long as it's not the first step
    if (step === 0) return;
    setStep(step - 1);
    navigate(`${routes[step - 1]}`);
  };

  return (
    <Container component="main" sx={{flexGrow: 1}}>
      <Stack
        sx={{height: 'calc(100vh - 89px)'}}
        component="form"
        onSubmit={handleSubmit}
      >
        <Box
          sx={{
            display: 'flex',
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Routes>
            <Route
              path="name"
              element={
                <NameForm
                  handleChange={handleChange}
                  value={values.name}
                  touched={touched.name}
                  error={errors.name}
                />
              }
            />
            <Route
              path="address"
              element={
                <AddressForm
                  handleChange={handleChange}
                  value={values.address}
                  touched={touched.address}
                  error={errors.address}
                />
              }
            />
            <Route
              path="phone"
              element={
                <PhoneForm
                  handleChange={handleChange}
                  value={values.phone}
                  touched={touched.phone}
                  error={errors.phone}
                />
              }
            />
            <Route
              path="*"
              element={
                <NameForm
                  handleChange={handleChange}
                  value={values.name}
                  touched={touched.name}
                  error={errors.name}
                />
              }
            />
          </Routes>
        </Box>
        <Divider />
        <Stack
          sx={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingY: 2,
          }}
        >
          <Button
            onClick={handleGoBack}
            size="large"
            startIcon={<ArrowBackIcon />}
          >
            Go Back
          </Button>
          <Button
            onClick={handleNextStep}
            variant="contained"
            size="large"
            type="submit"
          >
            Save and Continue
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};
