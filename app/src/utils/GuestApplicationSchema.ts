import {array, date, object, string} from 'yup';

export const GuestApplicationSchema = [
  //validation is based on step
  object({
    fullName: string().required(),
    dateOfBirth: date()
      .required()
      .default(() => new Date()),
    gender: string().required(),
  }),
  object({
    email: string().email(),
    phoneNumber: string()
      .required()
      .matches(
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
        'Phone number is not valid.',
      ),
    contactPrefrence: string().required(),
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
    currentlyEmployed: string().required(),
    employmentSearch: string().when('currentlyEmployed', {
      is: (currentlyEmployed: string) => currentlyEmployed === 'No',
      then: string().required(),
    }),
    employmentDescription: string().when('currentlyEmployed', {
      is: (currentlyEmployed: string) => currentlyEmployed === 'Yes',
      then: string().required(),
    }),
  }),
  object({
    educationEnrollment: string().required(),
    educationEnrollmentSearch: string().when('educationEnrollment', {
      is: (educationEnrollment: string) => educationEnrollment === 'No',
      then: string().required(),
    }),
    educationProgramName: string().when('educationEnrollment', {
      is: (educationEnrollment: string) => educationEnrollment === 'Yes',
      then: string().required(),
    }),
  }),
  object({
    multilingual: string().required(),
    spokenLanguages: string().when('multilingual', {
      is: (multilingual: string) => multilingual === 'Yes',
      then: string().required(),
    }),
  }),
  object({
    cigarettesUse: string().required(),
    alcoholUse: string().required(),
    otherSubstanceUse: string().required(),
  }),
  object({
    mentalIllness: string().required(),
  }),
  object({
    programGoals: string().required(),
    hostRelationshipGoal: string().required(),
    potentialChallenges: string().required(),
  }),
];
