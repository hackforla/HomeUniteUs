import {faker} from '@faker-js/faker';

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
