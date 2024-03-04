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
export const stepToRouteMapping: {[key: number]: string} = {
  0: 'welcome',
  1: 'expectations',
  2: 'basic',
  3: 'guestAndPets',
  4: 'employment',
  5: 'education',
  6: 'language',
  7: 'substanceUse',
  8: 'mentalHealth',
  9: 'interests',
  10: 'about',
  11: 'review',
};
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

export const GuestApplicationContext = () => {
  const [step, setStep] = useState<number>(0);
  const [showSections, setShowSections] = useState<boolean>(false);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    navigate(stepToRouteMapping[step]);
  }, []);
  function saveData() {
    //add logic to save current data
    console.log('data saving features not implemented');
  }
  function nextStep() {
    saveData();
    const newStep = step + 1;
    if (stepToRouteMapping[newStep] !== undefined) {
      setStep(newStep);
      navigate(stepToRouteMapping[newStep]);
    } else {
      alert('Form not complete!');
    }
  }
  function prevStep() {
    const newStep = step - 1;
    if (step > 0) {
      setStep(newStep);
      navigate(stepToRouteMapping[newStep]);
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
            <Sections />
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
