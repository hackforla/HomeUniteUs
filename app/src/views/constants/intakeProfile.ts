import {faker} from '@faker-js/faker';
import {array, object, string} from 'yup';

export const fieldTypes = [
  'short_text',
  'long_text',
  'number',
  'email',
  'dropdown',
  'multiple_choice',
  'yes_no',
  'additional_guests',
] as const;

type FieldTypeTuple = typeof fieldTypes;

export type FieldTypes = FieldTypeTuple[number];

export interface Choice {
  id: string;
  label: string;
}

export interface Fields {
  id: string;
  title: string;
  type: FieldTypes;
  properties: {
    description?: string;
    randomize?: boolean;
    alphabetical_order?: boolean;
    allow_multiple_selection?: boolean;
    allow_other_choice?: boolean;
    choices?: Choice[];
  };
  validations: {
    required?: boolean;
    max_characters?: number;
  };
}

export interface FieldGroup {
  id: string;
  title: string;
  fields: Fields[];
}

export interface Guest {
  id: string;
  name: string;
  dob: string;
  relationship: string;
}

export interface Answer {
  id: string;
  fieldId: string;
  value: string | Guest[] | undefined;
}

export const fieldGroupBuilder = (
  options: Partial<FieldGroup> = {},
): FieldGroup => ({
  id: faker.string.numeric(4),
  title: faker.lorem.sentence({min: 2, max: 4}),
  fields: [],
  ...options,
});

export const fieldBuilder = (options: Partial<Fields> = {}): Fields => ({
  id: faker.string.numeric(4),
  title: faker.lorem.sentence({min: 5, max: 10}),
  type: faker.helpers.arrayElement(fieldTypes),
  ...options,
  properties: {
    ...options.properties,
  },
  validations: {
    ...options.validations,
  },
});

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const validations = {
  short_text: string().required('This field is required'),
  long_text: string().required('This field is required'),
  number: string()
    .matches(phoneRegExp, 'phone number is not valid')
    .required('This field is required'),
  email: string().email().required('This field is required'),
  yes_no: string().required('This field is required'),
  dropdown: string().required('This field is required'),
  multiple_choice: string().required('This field is required'),
  additional_guests: array().of(
    object().shape({
      name: string().required('Name is required'),
      dob: string().required('DOB is required'),
      relationship: string().required('Relationship is required'),
    }),
  ),
};
