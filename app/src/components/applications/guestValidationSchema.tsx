import {object, string, boolean} from 'yup';

const personalInfoSchema = object({
  firstName: string().required('First name is required'),
  middleName: string().required('Middle name is required'),
  lastName: string().required('Last name is required'),
  // Use transform to convert date to ISO string
  dateOfBirth: string().required('Date of birth is required'),
});

const employmentInfoSchema = object({
  isEmployed: boolean().nullable().required('This field is required'),
  employmentDescription: string().when('isEmployed', {
    is: true,
    then: string().required('Employment description is required'),
  }),
});

const addressSchema = string().required('Address is required');
const phoneSchema = string().required('Phone number is required');
const petsSchema = string().required('Pets is required');

// Form validation schema
export const guestValidationSchema = object({
  ...personalInfoSchema.fields,
  ...employmentInfoSchema.fields,
  addressSchema,
  phoneSchema,
  petsSchema,
});

export const getSchemaFromRoute = (route: string) => {
  switch (route) {
    case 'personal':
      return personalInfoSchema;
    case 'employment':
      return employmentInfoSchema;
    case 'address':
      return addressSchema;
    case 'phone':
      return phoneSchema;
    case 'pets':
      return petsSchema;
  }
};
