import * as React from 'react';
import {Button, Container, Divider, Stack, Box} from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import {Route, Routes, useNavigate, useParams} from 'react-router-dom';
import {Formik} from 'formik';
import {
  AddressForm,
  PersonalInfoForm,
  PhoneForm,
  PetsForm,
  EmploymentForm,
} from '../components/applications/guest-forms';
import {getSchemaAndKeysFromRoute} from '../components/applications';

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

/**
 *
 * @param values - Formik values
 * @param keys - Keys of values to be selected
 * @returns - An object containing the values selected from the formik values
 */

const getValuesFromKeys = (
  values: FormValues,
  keys: Array<keyof FormValues>,
) => {
  return keys.reduce((acc, key) => {
    acc[key] = values[key];
    return acc;
  }, {} as Partial<FormValues>);
};

// list out routes in order in which to visit them
const routes = ['personal', 'employment', 'address', 'phone', 'pets'];

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
      middleName: 'a',
      lastName: 'a',
      dateOfBirth: 'a',
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

  // get the validation schema and keys for the current route
  const {validationSchema, keys} = getSchemaAndKeysFromRoute(routes[step]);

  return (
    <Formik
      // use loaded form values if they exist
      initialValues={formValues || initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, {setSubmitting}) => {
        // parse current values to submit from keys
        const valuesToSubmit = keys ? getValuesFromKeys(values, keys) : values;
        console.log(valuesToSubmit);
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
                <Route path="personal" element={<PersonalInfoForm />} />
                <Route path="employment" element={<EmploymentForm />} />
                <Route path="address" element={<AddressForm />} />
                <Route path="phone" element={<PhoneForm />} />
                <Route path="pets" element={<PetsForm />} />
                <Route path="*" element={<PersonalInfoForm />} />
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
