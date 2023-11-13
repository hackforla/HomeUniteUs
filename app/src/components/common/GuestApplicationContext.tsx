import {Stack} from '@mui/material';
import {Formik} from 'formik';
import {useState} from 'react';
import {Outlet, useOutletContext} from 'react-router-dom';
import ProgressBar from './ProgressBar';
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

type stepperTypes = {
  step: number;
  TOTALPAGES: number;
  setStep: (setStep: number) => void;
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
  const TOTALPAGES = 10;
  const [step, setStep] = useState<number>(1);
  const progressBarValue = (step / TOTALPAGES) * 100;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={() => console.log('Parent wrapper submit')}
      validationSchema={GuestApplicationSchema[step - 1]} //schema array is index of 0 hence -1
    >
      <Stack padding={2} spacing={2}>
        <ProgressBar progressBarValue={progressBarValue} />
        <Outlet context={{step, setStep, TOTALPAGES} satisfies stepperTypes} />
      </Stack>
    </Formik>
  );
};

export function stepContext() {
  return useOutletContext<stepperTypes>();
}
