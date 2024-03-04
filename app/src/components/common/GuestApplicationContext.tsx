import {Box, Stack, useTheme} from '@mui/material';
import {Formik} from 'formik';
import {useEffect, useState} from 'react';
import {Outlet} from 'react-router-dom';
import {GuestApplicationSchema} from '../../utils/GuestApplicationSchema';
import {NavButtons} from './GuestApplicationButtons';
import {useNavigate} from 'react-router-dom';
import {Sections} from '../../views/guestApplicationForm/Sections';

export interface formInputValues {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phoneNumber: string;
  contactPrefrence: string;
  nameOfGuest: Array<string>;
  typeOfPet: Array<string>;
  currentlyEmployed: string;
  employmentSearch: string;
  employmentDescription: string;
  educationEnrollment: string;
  educationEnrollmentSearch: string;
  educationProgramName: string;
  multilingual: string;
  spokenLanguages: string;
  cigarettesUse: string;
  alcoholUse: string;
  otherSubstanceUse: string;
  mentalIllness: string;
  programGoals: string;
  hostRelationshipGoal: string;
  potentialChallenges: string;
}
export const initialValues = {
  fullName: '',
  dateOfBirth: '',
  gender: '',
  email: '',
  phoneNumber: '',
  contactPrefrence: '',
  nameOfGuest: [''],
  typeOfPet: [''],
  currentlyEmployed: '',
  employmentSearch: '',
  employmentDescription: '',
  educationEnrollment: '',
  educationEnrollmentSearch: '',
  educationProgramName: '',
  multilingual: '',
  spokenLanguages: '',
  cigarettesUse: '',
  alcoholUse: '',
  otherSubstanceUse: '',
  mentalIllness: '',
  programGoals: '',
  hostRelationshipGoal: '',
  potentialChallenges: '',
};
export const stepToRouteMapping: {
  [key: number]: {complete: boolean; innerText: string; route: string};
} = {
  0: {
    complete: true,
    innerText: 'Welcome',
    route: 'welcome',
  },
  1: {
    complete: false,
    innerText: 'Expectations',
    route: 'expectations',
  },
  2: {
    complete: false,
    innerText: 'Basic',
    route: 'basic',
  },
  3: {
    complete: false,
    innerText: 'Guest and Pets',
    route: 'guestAndPets',
  },
  4: {
    complete: false,
    innerText: 'Employment',
    route: 'employment',
  },
  5: {
    complete: false,
    innerText: 'Education',
    route: 'education',
  },
  6: {
    complete: false,
    innerText: 'Language',
    route: 'language',
  },
  7: {
    complete: false,
    innerText: 'Substance Use',
    route: 'substanceUse',
  },
  8: {
    complete: false,
    innerText: 'Mental Health',
    route: 'mentalHealth',
  },
  9: {
    complete: false,
    innerText: 'Interests',
    route: 'interests',
  },
  10: {
    complete: false,
    innerText: 'About',
    route: 'about',
  },
  11: {
    complete: false,
    innerText: 'Review',
    route: 'review',
  },
};

export const GuestApplicationContext = () => {
  const [step, setStep] = useState<number>(0);
  const [showSections, setShowSections] = useState<boolean>(false);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    navigate(stepToRouteMapping[step].route);
    setShowSections(false);
  }, [step]);
  function saveData() {
    //add logic to save current data
    console.log('data saving features not implemented');
  }
  function nextStep() {
    saveData();
    const newStep = step + 1;
    if (stepToRouteMapping[newStep] !== undefined) {
      setStep(newStep);
    } else {
      alert('Form not complete!');
    }
  }
  function prevStep() {
    const newStep = step - 1;
    if (step > 0) {
      setStep(newStep);
    } else {
      navigate('/guest');
    }
  }
  function openSections() {
    setShowSections(true);
    console.log('Open sections');
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={() => console.log('Parent wrapper submit')}
      validationSchema={GuestApplicationSchema[step]}
    >
      <Stack>
        {showSections ? (
          <Stack
            sx={{
              backgroundColor: theme.palette.grey[50],
              zIndex: 1000,
            }}
          >
            <Sections
              setStep={setStep}
              stepToRouteMapping={stepToRouteMapping}
            />
          </Stack>
        ) : (
          <Box
            padding={2}
            gap={0}
            height={'95vh'}
            sx={{backgroundColor: theme.palette.grey[50]}}
          >
            <Stack
              marginTop={2}
              overflow={'scroll'}
              minHeight={'72%'}
              maxHeight={'72%'}
            >
              <Outlet />
            </Stack>
            <Stack>
              <NavButtons
                next={nextStep}
                prev={prevStep}
                openSections={openSections}
              />
            </Stack>
          </Box>
        )}
      </Stack>
    </Formik>
  );
};
