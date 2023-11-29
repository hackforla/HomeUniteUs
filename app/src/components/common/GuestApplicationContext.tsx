import {Stack} from '@mui/material';
import {Formik} from 'formik';
import {useEffect, useState} from 'react';
import {Outlet} from 'react-router-dom';
import ProgressBar from './ProgressBar';
import {GuestApplicationSchema} from '../../utils/GuestApplicationSchema';
import {NavButtons} from './GuestApplicationButtons';
import {useNavigate} from 'react-router-dom';

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
  1: '',
  2: 'tester2',
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
  const TOTALPAGES = 10; /*Once all forms are made and added to "stepToRouteMapping", make this number change based on "stepToRouteMapping"*/
  const storedStep = localStorage.getItem('currentStep');
  const initialStep = storedStep ? parseInt(storedStep, 10) : 1;
  const [step, setStep] = useState<number>(initialStep);
  const progressBarValue = (step / TOTALPAGES) * 100;
  const navigate = useNavigate();

  useEffect(() => {
    navigate(stepToRouteMapping[step]);
  }, []);
  useEffect(() => {
    localStorage.setItem('currentStep', step.toString());
  }, [step]);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={() => console.log('Parent wrapper submit')}
      validationSchema={GuestApplicationSchema[step - 1]}
    >
      <Stack
        padding={2}
        spacing={2}
        height="100vh"
        justifyContent="space-between"
      >
        <Stack>
          <ProgressBar progressBarValue={progressBarValue} />
        </Stack>
        <Stack>
          <Outlet />
        </Stack>
        <Stack>
          <NavButtons
            step={step}
            setStep={setStep}
            stepToRouteMapping={stepToRouteMapping}
          />
        </Stack>
      </Stack>
    </Formik>
  );
};
