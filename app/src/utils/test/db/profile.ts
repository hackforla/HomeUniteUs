import {faker} from '@faker-js/faker';
import {GetProfileApiResponse} from 'src/services/profile';

export const intakeProfiles: GetProfileApiResponse[] = [
  {
    id: '1',
    fieldGroups: [
      {
        id: faker.string.numeric(4),
        title: 'Personal Information',
        fields: [
          {
            id: faker.string.numeric(4),
            title: 'First Name',
            type: 'short_text',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: faker.string.numeric(4),
            title: 'Last Name',
            type: 'short_text',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: faker.string.numeric(4),
            title: 'Date of Birth',
            type: 'short_text',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: faker.string.numeric(4),
            title: 'Gender',
            type: 'dropdown',
            properties: {
              choices: [
                {id: faker.string.numeric(4), label: 'Woman'},
                {id: faker.string.numeric(4), label: 'Man'},
                {id: faker.string.numeric(4), label: 'Questioning'},
                {id: faker.string.numeric(4), label: 'Transgender'},
                {id: faker.string.numeric(4), label: 'Non-binary'},
                {
                  id: faker.string.numeric(4),
                  label: 'Doesn’t know or prefers not to answer	',
                },
              ],
            },
            validations: {
              required: true,
            },
          },
        ],
      },
      {
        id: faker.string.numeric(4),
        title: 'Contact Information',
        fields: [
          {
            id: faker.string.numeric(4),
            title: 'Email',
            type: 'email',
            properties: {},
            validations: {},
          },
          {
            id: faker.string.numeric(4),
            title: 'Phone Number',
            type: 'number',
            properties: {},
            validations: {},
          },
        ],
      },
      {
        id: faker.string.numeric(4),
        title: 'Other Guests and/or Pets',
        fields: [
          {
            id: faker.string.numeric(4),
            title: 'Additional Guests',
            type: 'additional_guests',
            properties: {},
            validations: {},
          },
        ],
      },
      {
        id: faker.string.numeric(4),
        title: 'Employment Information',
        fields: [
          {
            id: faker.string.numeric(4),
            title: 'Are you currently employed?',
            type: 'yes_no',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: faker.string.numeric(4),
            title:
              'If no, are you currently looking for work? If so, what type?',
            type: 'long_text',
            properties: {},
            validations: {},
          },
          {
            id: faker.string.numeric(4),
            title: 'If yes, please describe your current employment',
            type: 'long_text',
            properties: {},
            validations: {},
          },
        ],
      },
    ],
  },
  {
    id: '2',
    fieldGroups: [
      {
        id: faker.string.numeric(4),
        title: 'Personal Information',
        fields: [
          {
            id: faker.string.numeric(4),
            title: 'First Name',
            type: 'short_text',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: faker.string.numeric(4),
            title: 'Last Name',
            type: 'short_text',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: faker.string.numeric(4),
            title: 'Date of Birth',
            type: 'short_text',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: faker.string.numeric(4),
            title: 'Gender',
            type: 'dropdown',
            properties: {
              choices: [
                {id: faker.string.numeric(4), label: 'Woman'},
                {id: faker.string.numeric(4), label: 'Man'},
                {id: faker.string.numeric(4), label: 'Questioning'},
                {id: faker.string.numeric(4), label: 'Transgender'},
                {id: faker.string.numeric(4), label: 'Non-binary'},
                {
                  id: faker.string.numeric(4),
                  label: 'Doesn’t know or prefers not to answer	',
                },
              ],
            },
            validations: {
              required: true,
            },
          },
        ],
      },
      {
        id: faker.string.numeric(4),
        title: 'Contact Information',
        fields: [
          {
            id: faker.string.numeric(4),
            title: 'Email',
            type: 'email',
            properties: {},
            validations: {},
          },
          {
            id: faker.string.numeric(4),
            title: 'Phone Number',
            type: 'number',
            properties: {},
            validations: {},
          },
        ],
      },
      {
        id: faker.string.numeric(4),
        title: 'Other Guests and/or Pets',
        fields: [
          {
            id: faker.string.numeric(4),
            title: 'Additional Guests',
            type: 'additional_guests',
            properties: {},
            validations: {},
          },
        ],
      },
      {
        id: faker.string.numeric(4),
        title: 'Employment Information',
        fields: [
          {
            id: faker.string.numeric(4),
            title: 'Are you currently employed?',
            type: 'yes_no',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: faker.string.numeric(4),
            title:
              'If no, are you currently looking for work? If so, what type?',
            type: 'short_text',
            properties: {},
            validations: {},
          },
          {
            id: faker.string.numeric(4),
            title: 'If yes, please describe your current employment',
            type: 'short_text',
            properties: {},
            validations: {},
          },
        ],
      },
    ],
  },
];
