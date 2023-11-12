import {Stack} from '@mui/material';
import {Formik} from 'formik';
import {useState} from 'react';
import {Outlet} from 'react-router-dom';
import ProgressBar from './ProgressBar';
import {
  NextStepButton,
  PrevStepButton,
  SaveAndExitButton,
} from './GuestApplicationButtons';
import {GuestApplicationSchema} from '../../utils/GuestApplicationSchema';

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

export const GuestApplicationContext = () => {
  const TOTALPAGES = 10;
  const [step, setStep] = useState<number>(1);
  const progressBarValue = (step / TOTALPAGES) * 100;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={() => console.log('Parent wrapper submit')}
      step={step}
      setStep={setStep}
      validationSchema={GuestApplicationSchema[step - 1]} //schema array is index of 0 hence -1
    >
      <Stack padding={2} spacing={2}>
        <ProgressBar progressBarValue={progressBarValue} />
        <Outlet />
        <Stack gap={2}>
          <NextStepButton
            step={step}
            setStep={setStep}
            TOTALPAGES={TOTALPAGES}
            nextPage={'/guest'}
          />
          <PrevStepButton
            step={step}
            setStep={setStep}
            prevPage={'/coordinator'}
          />
          <SaveAndExitButton />
        </Stack>
      </Stack>
    </Formik>
  );
};
