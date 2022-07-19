import * as React from 'react';
import {Button, Container, Divider, Stack, Box} from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import {Route, Routes, useNavigate, useParams} from 'react-router-dom';
import {Formik} from 'formik';
import {
  AddressForm,
  NameForm,
  PhoneForm,
  PetsForm,
  EmploymentForm,
} from '../components/applications/guest-forms';
import {boolean, object, string} from 'yup';

export interface FormValues {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  isEmployed: boolean | null;
  employmentDescription: string;
  address: string;
  phone: string;
  pets: string;
}
// Initial formik values
const initialValues: FormValues = {
  firstName: '',
  middleName: '',
  lastName: '',
  dateOfBirth: '',
  isEmployed: null,
  employmentDescription: '',
  address: '',
  phone: '',
  pets: '',
};

// Form validation schema
const validationSchema = object({
  firstName: string().required('First name is required'),
  middleName: string().required('Middle name is required'),
  lastName: string().required('Last name is required'),
  // Use transform to convert date to ISO string
  dateOfBirth: string().required('Date of birth is required'),
  isEmployed: boolean().required('Is employed is required'),
  employmentDescription: string().when('isEmployed', {
    is: true,
    then: string().required('Employment description is required'),
  }),
  address: string().required('Address is required'),
  phone: string().required('Phone is required'),
  pets: string().required('Pets is required'),
});

// list out routes in order in which to visit them
const routes = ['name', 'employment', 'address', 'phone', 'pets'];

export const GuestApplicationTracker = () => {
  const navigate = useNavigate();
  const params = useParams();
  // use url params to set initial state for step incase of refresh
  const [step, setStep] = React.useState(
    () => routes.indexOf(params['*'] || '') || 0,
  );
  const [formValues, setFormValues] = React.useState<FormValues | null>(null);

  React.useEffect(() => {
    // use a fake request and data for form values
    const updatedValues = {
      firstName: 'Erik Guntner',
      middleName: '',
      lastName: '',
      dateOfBirth: '',
      isEmployed: null,
      employmentDescription: '',
      address: '732 North Main St',
      phone: '555-555-5555',
      pets: '',
    };

    setTimeout(() => {
      setFormValues(updatedValues);
    }, 1000);
  }, []);

  const nextStep = () => {
    // increment step as long as it's not the last step
    if (step < routes.length - 1) {
      setStep(step + 1);
      navigate(`${routes[step + 1]}`);
    }
  };

  const goBack = () => {
    // decrement step as long as it's not the first step
    if (step === 0) return;
    setStep(step - 1);
    navigate(`${routes[step - 1]}`);
  };

  return (
    <Formik
      // use loaded form values if they exist
      initialValues={formValues || initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, {setSubmitting}) => {
        nextStep();
        setTimeout(() => {
          setSubmitting(false);
        }, 600);
      }}
      // allow form to be values to be updated
      enableReinitialize={true}
    >
      {({handleSubmit, isSubmitting}) => (
        <Container maxWidth="md" component="main" sx={{flexGrow: 1}}>
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
                justifyContent: 'start',
                overflowY: 'scroll',
              }}
            >
              <Routes>
                <Route path="name" element={<NameForm />} />
                <Route path="employment" element={<EmploymentForm />} />
                <Route path="address" element={<AddressForm />} />
                <Route path="phone" element={<PhoneForm />} />
                <Route path="pets" element={<PetsForm />} />
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
                onClick={goBack}
                disabled={step === 0}
                color="inherit"
                size="large"
                startIcon={<ArrowBackIosNewRoundedIcon />}
              >
                Go Back
              </Button>
              <Stack sx={{flexDirection: 'row', gap: 2}}>
                <Button
                  onClick={nextStep}
                  color="inherit"
                  size="large"
                  endIcon={<ArrowForwardIosRoundedIcon />}
                >
                  Skip
                </Button>
                <Button
                  disabled={isSubmitting}
                  variant="contained"
                  size="large"
                  type="submit"
                >
                  Save and Continue
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      )}
    </Formik>
  );
};
