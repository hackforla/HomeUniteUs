import {array, date, object, string} from 'yup';

export const GuestApplicationSchema = [
  //validation is based on step
  object({
    fullName: string().required('Name is required'),
    dateOfBirth: date().required('Date of Birth is required').max(new Date()),
    gender: string().required('Select an option'),
  }),
  object({
    email: string().email().required('Email is required'),
    phoneNumber: string()
      .required()
      .matches(
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
        'Phone number is not valid.',
      )
      .required('Phone number is required'),
    contactPrefrence: string().required('Select an option'),
  }),
  object({
    nameOfGuestArray: array().of(
      object({
        nameOfGuest: string().required('Name is Required'),
      }),
    ),
    typeOfPetArray: array().of(
      object({
        typeOfPet: string().required('Pet Type is Required'),
      }),
    ),
  }),
  object({
    currentlyEmployed: string().required('Select an option'),
    employmentSearch: string().when('currentlyEmployed', {
      is: (currentlyEmployed: string) => currentlyEmployed === 'No',
      then: string().required('Field is required'),
    }),
    employmentDescription: string().when('currentlyEmployed', {
      is: (currentlyEmployed: string) => currentlyEmployed === 'Yes',
      then: string().required('Field is required'),
    }),
  }),
  object({
    educationEnrollment: string().required('Select an option'),
    educationEnrollmentSearch: string().when('educationEnrollment', {
      is: (educationEnrollment: string) => educationEnrollment === 'No',
      then: string().required('Field is required'),
    }),
    educationProgramName: string().when('educationEnrollment', {
      is: (educationEnrollment: string) => educationEnrollment === 'Yes',
      then: string().required('Field is required'),
    }),
  }),
  object({
    multilingual: string().required('Select an option'),
    spokenLanguages: string().when('multilingual', {
      is: (multilingual: string) => multilingual === 'Yes',
      then: string().required('Field is required'),
    }),
  }),
  object({
    cigarettesUse: string().required('Select an option'),
    alcoholUse: string().required('Select an option'),
    otherSubstanceUse: string().required('Select an option'),
  }),
  object({
    mentalIllness: string().required('Select an option'),
  }),
  object({
    programGoals: string().required('Field is required'),
    hostRelationshipGoal: string().required('Field is required'),
    potentialChallenges: string().required('Field is required'),
  }),
];
