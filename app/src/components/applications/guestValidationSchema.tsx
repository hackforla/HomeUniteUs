import {object, string, boolean} from 'yup';
import {FormValues} from '../../views/GuestApplicationTracker';

// Create separate validation schemas for each form/page.
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

// Combine all validation schemas into one for final check when submitting full form.
export const guestValidationSchema = object({
  ...personalInfoSchema.fields,
  ...employmentInfoSchema.fields,
  addressSchema,
  phoneSchema,
  petsSchema,
});

type Schemas =
  | typeof personalInfoSchema
  | typeof employmentInfoSchema
  | typeof addressSchema
  | typeof phoneSchema
  | typeof petsSchema;

/**
 * Retrieves the validation schema and the corresponding keys from the form values.
 * @param route - The route to validate
 * @returns - An object containing the validation schema for the current route and keys of the form values to be selected on submit.
 */
export const getSchemaAndKeysFromRoute = (
  route: string,
): {
  validationSchema: Schemas;
  keys: Array<keyof FormValues>;
} => {
  switch (route) {
    case 'personal':
      return {
        validationSchema: personalInfoSchema,
        keys: ['firstName', 'middleName', 'lastName', 'dateOfBirth'],
      };
    case 'employment':
      return {
        validationSchema: employmentInfoSchema,
        keys: ['isEmployed', 'employmentDescription'],
      };
    case 'address':
      return {validationSchema: addressSchema, keys: ['address']};
    case 'phone':
      return {validationSchema: phoneSchema, keys: ['phone']};
    case 'pets':
      return {validationSchema: petsSchema, keys: ['pets']};
    default:
      throw new Error(`Unknown route: ${route}`);
  }
};
