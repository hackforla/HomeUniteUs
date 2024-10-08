import {faker} from '@faker-js/faker';
import {GetProfileApiResponse} from 'src/services/profile';

const emailFieldId = faker.string.numeric(4);
const phoneFieldId = faker.string.numeric(4);

export const intakeProfiles: GetProfileApiResponse[] = [
  {
    id: '1',
    fieldGroups: [
      {
        id: faker.string.numeric(4),
        title: 'Basic Information',
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
            type: 'date',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: faker.string.numeric(4),
            title: 'Gender Identity',
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
            id: emailFieldId,
            title: 'Email',
            type: 'email',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: phoneFieldId,
            title: 'Phone Number',
            type: 'number',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: faker.string.numeric(4),
            title: 'What is the best way to contact you?',
            type: 'contact_method',
            properties: {},
            validations: {
              required: true,
            },
            linkedFields: {
              emailFieldId: emailFieldId,
              phoneFieldId: phoneFieldId,
            },
          },
        ],
      },
      {
        id: faker.string.numeric(4),
        title: 'Other Guests/Pets',
        fields: [
          {
            id: faker.string.numeric(4),
            title: 'Additional Guests',
            type: 'additional_guests',
            properties: {},
            validations: {},
          },
          {
            id: faker.string.numeric(4),
            title: 'Do you have any pets in your care?',
            type: 'yes_no',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: faker.string.numeric(4),
            title: 'Pet Type',
            type: 'pets',
            properties: {},
            validations: {
              required: false,
            },
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
            title: 'If yes, please describe your employment.',
            type: 'long_text',
            properties: {},
            validations: {
              required_if: {
                field_id: '5478',
                value: 'yes',
              },
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
        ],
      },
      {
        id: faker.string.numeric(4),
        title: 'Education',
        fields: [
          {
            id: '6478',
            title: 'Are you enrolled in an Educational Program?',
            type: 'yes_no',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: faker.string.numeric(4),
            title: 'If yes, please describe the program.',
            type: 'long_text',
            properties: {},
            validations: {
              required_if: {
                field_id: '6478',
                value: 'yes',
              },
            },
          },
          {
            id: faker.string.numeric(4),
            title:
              'If no, are you hoping to enroll in an Educational Program? If so, what type?',
            type: 'long_text',
            properties: {},
            validations: {
              required_if: {
                field_id: '6478',
                value: 'no',
              },
            },
          },
        ],
      },
      {
        id: faker.string.numeric(4),
        title: 'Language Proficiency',
        fields: [
          {
            id: '5479',
            title: 'Are you bilingual or multilingual?',
            type: 'yes_no',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: faker.string.numeric(4),
            title: 'If yes, what languages do you speak?',
            type: 'long_text',
            properties: {},
            validations: {
              required_if: {
                field_id: '5479',
                value: 'yes',
              },
            },
          },
        ],
      },
      {
        id: faker.string.numeric(4),
        title: 'Substance Use',
        fields: [
          {
            id: faker.string.numeric(4),
            title: 'Do you smoke cigarettes?',
            type: 'yes_no',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: faker.string.numeric(4),
            title: 'Do you drink alcohol?',
            type: 'yes_no',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: faker.string.numeric(4),
            title: 'Do you use any other substances?',
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
        title: 'Mental Health',
        fields: [
          {
            id: faker.string.numeric(4),
            title: 'Do you suffer mental illness?',
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
        title: 'Interest in Being a Guest',
        fields: [
          {
            id: faker.string.numeric(4),
            title:
              'Please share how you think participating in the Host Homes Program will help you obtain long-term housing and meet your educational and/or employment goals:',
            type: 'long_text',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: faker.string.numeric(4),
            title:
              'What kind of relationship do you hope to have with your host home?',
            type: 'long_text',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: faker.string.numeric(4),
            title:
              'Please describe any challenges you foresee encountering in participating in the Host Homes Program.',
            type: 'long_text',
            properties: {},
            validations: {
              required: true,
            },
          },
        ],
      },
      {
        id: faker.string.numeric(4),
        title: 'About You',
        fields: [
          {
            id: faker.string.numeric(4),
            title:
              'Please take some time to write an introduction of yourself that you would feel comfortable with the Host Homes Coordinator sharing with a potential host. Feel free to talk about your interests, your story or anything else that you think would be important to share:',
            type: 'long_text',
            properties: {},
            validations: {
              required: true,
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
