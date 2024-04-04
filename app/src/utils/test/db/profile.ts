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
            id: '5478',
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
            validations: {
              required_if: {
                field_id: '5478',
                value: 'no',
              },
            },
          },
          {
            id: faker.string.numeric(4),
            title: 'If yes, please describe your current employment',
            type: 'long_text',
            properties: {},
            validations: {
              required_if: {
                field_id: '5478',
                value: 'yes',
              },
            },
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
        title: 'Home Information',
        fields: [
          {
            id: faker.string.numeric(4),
            title:
              'Do you have an extra bedroom or private space in their home?',
            type: 'yes_no',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: faker.string.numeric(4),
            title:
              'Are you able to provide Guest with access to a kitchen in which to prepare meals, store food and access to shared or private bathroom?',
            type: 'yes_no',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: faker.string.numeric(4),
            title:
              'Can you commit to hosting youth Guest for at least 3-6 months?',
            type: 'yes_no',
            properties: {},
            validations: {
              required: true,
            },
          },
        ],
      },
      {
        id: faker.string.numeric(4),
        title: 'Restrictions',
        fields: [
          {
            id: faker.string.numeric(4),
            title: 'Do you or anyone in your houshold smoke?',
            type: 'yes_no',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: faker.string.numeric(4),
            title: 'Is smoking allowed inside your home?',
            type: 'yes_no',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: faker.string.numeric(4),
            title: 'Do you or anyone in your household drink alcohol?',
            type: 'yes_no',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: '9846',
            title: 'Do you have concerns about your drinking?',
            type: 'yes_no',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: faker.string.numeric(4),
            title: 'If yes, please explain why you are concerned',
            type: 'long_text',
            properties: {},
            validations: {
              required_if: {
                field_id: '9846',
                value: 'yes',
              },
            },
          },
        ],
      },
    ],
  },
];
