import {Formik} from 'formik';
import {Outlet} from 'react-router-dom';

export const initialValues = {
  fullName: '',
  dateOfBirth: '',
  gender: '',
  email: '',
  phoneNumber: '',
  contactPrefrence: ['Phone', 'Email'],
  nameOfGuest: [],
  typeOfPet: [],
  currentlyEmployed: ['Yes', 'No'],
  employmentSearch: '',
  employmentDescription: '',
  educationEnrollment: ['Yes', 'No'],
  educationEnrollmentSearch: '',
  educationProgramName: '',
  multilingual: ['Yes', 'No'],
  spokenLanguages: '',
  cigarettesUse: ['Yes', 'No'],
  alcoholUse: ['Yes', 'No'],
  otherSubstanceUse: ['Yes', 'No'],
  mentalIllness: ['Yes', 'No'],
  programGoals: '',
  hostRelationshipGoal: '',
  potentialChallenges: '',
};

export const GuestApplicationContext = () => {
  return (
    <Formik initialValues={initialValues} onSubmit={() => console.log('hello')}>
      <Outlet />
    </Formik>
  );
};
