import * as React from 'react';
import {Button, Container, Divider, Stack, Box} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {Route, Routes, useNavigate} from 'react-router-dom';
import {useFormik} from 'formik';

const NameForm = () => {
  return <Box>Name form</Box>;
};

const AddressForm = () => {
  return <div>address form</div>;
};

const PhoneForm = () => {
  return <div>phone form</div>;
};

const routes = ['name', 'address', 'phone'];

export const GuestApplicationTracker = () => {
  const [step, setStep] = React.useState(0);
  const navigate = useNavigate();
  const {handleSubmit} = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      address: '',
      phone: '',
    },
    onSubmit: values => {
      console.log(values);
    },
  });

  const handleNextStep = () => {
    if (step < routes.length - 1) {
      setStep(step + 1);
      navigate(`${routes[step + 1]}`);
    }
  };

  const handleGoBack = () => {
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
            <Route path="name" element={<NameForm />} />
            <Route path="address" element={<AddressForm />} />
            <Route path="phone" element={<PhoneForm />} />
            <Route path="*" element={<NameForm />} />
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
