import {faker} from '@faker-js/faker';
import {GetProfileApiResponse} from 'src/services/profile';

const emailFieldId = faker.string.numeric(4);
const phoneFieldId = faker.string.numeric(4);

export const intakeProfiles: GetProfileApiResponse[] = [
  {
    id: '1',
    fieldGroups: [
      {
        id: 'basic-information',
        title: 'Basic Information',
        fields: [
          {
            id: 'first-name',
            title: 'First Name',
            type: 'short_text',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: 'last-name',
            title: 'Last Name',
            type: 'short_text',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: 'date-of-birth',
            title: 'Date of Birth',
            type: 'date',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: 'gender-identity',
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
        id: 'contact-information',
        title: 'Contact Information',
        fields: [
          {
            id: 'email',
            title: 'Email',
            type: 'email',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: 'phone-number',
            title: 'Phone Number',
            type: 'number',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: 'contact-method',
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
        id: 'guests-and-pets',
        title: 'Other Guests/Pets',
        fields: [
          {
            id: 'additional-guests',
            title: 'Additional Guests',
            type: 'additional_guests',
            properties: {},
            validations: {},
          },
          {
            id: 'pets',
            title: 'Do you have any pets in your care?',
            type: 'yes_no',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: 'pet-type',
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
        id: 'employment-information',
        title: 'Employment Information',
        fields: [
          {
            id: 'employment-status',
            title: 'Are you currently employed?',
            type: 'yes_no',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: 'employment-description',
            title: 'If yes, please describe your employment.',
            type: 'long_text',
            properties: {},
            validations: {
              required_if: {
                field_id: 'employment-status',
                value: 'yes',
              },
            },
          },
          {
            id: 'employment-search',
            title:
              'If no, are you currently looking for work? If so, what type?',
            type: 'long_text',
            properties: {},
            validations: {
              required_if: {
                field_id: 'employment-status',
                value: 'no',
              },
            },
          },
        ],
      },
      {
        id: 'education',
        title: 'Education',
        fields: [
          {
            id: 'enrollment-status',
            title: 'Are you enrolled in an Educational Program?',
            type: 'yes_no',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: 'education-description',
            title: 'If yes, please describe the program.',
            type: 'long_text',
            properties: {},
            validations: {
              required_if: {
                field_id: 'enrollment-status',
                value: 'yes',
              },
            },
          },
          {
            id: 'education-search',
            title:
              'If no, are you hoping to enroll in an Educational Program? If so, what type?',
            type: 'long_text',
            properties: {},
            validations: {
              required_if: {
                field_id: 'enrollment-status',
                value: 'no',
              },
            },
          },
        ],
      },
      {
        id: 'language-proficiency',
        title: 'Language Proficiency',
        fields: [
          {
            id: 'bilingual',
            title: 'Are you bilingual or multilingual?',
            type: 'yes_no',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: 'languages',
            title: 'If yes, what languages do you speak?',
            type: 'long_text',
            properties: {},
            validations: {
              required_if: {
                field_id: 'bilingual',
                value: 'yes',
              },
            },
          },
        ],
      },
      {
        id: 'substance-use',
        title: 'Substance Use',
        fields: [
          {
            id: 'smoke',
            title: 'Do you smoke cigarettes?',
            type: 'yes_no',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: 'drink',
            title: 'Do you drink alcohol?',
            type: 'yes_no',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: 'other-substances',
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
        id: 'mental-health',
        title: 'Mental Health',
        fields: [
          {
            id: 'mental-health-status',
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
        id: 'interest',
        title: 'Interest in Being a Guest',
        fields: [
          {
            id: 'interest-goals',
            title:
              'Please share how you think participating in the Host Homes Program will help you obtain long-term housing and meet your educational and/or employment goals:',
            type: 'long_text',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: 'interest-relationship',
            title:
              'What kind of relationship do you hope to have with your host home?',
            type: 'long_text',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: 'interest-challenges',
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
        id: 'about-you',
        title: 'About You',
        fields: [
          {
            id: 'about-you-description',
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
        id: 'personal-information',
        title: 'Personal Information',
        fields: [
          {
            id: 'first-name',
            title: 'First Name',
            type: 'short_text',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: 'last-name',
            title: 'Last Name',
            type: 'short_text',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: 'date-of-birth',
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
        id: 'home-information',
        title: 'Home Information',
        fields: [
          {
            id: 'extra-bedrooms',
            title:
              'Do you have an extra bedroom or private space in their home?',
            type: 'yes_no',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: 'kitchen-bathroom-access',
            title:
              'Are you able to provide Guest with access to a kitchen in which to prepare meals, store food and access to shared or private bathroom?',
            type: 'yes_no',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: 'commitment',
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
        id: 'restrictions',
        title: 'Restrictions',
        fields: [
          {
            id: 'smoking',
            title: 'Do you or anyone in your houshold smoke?',
            type: 'yes_no',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: 'smoking-inside',
            title: 'Is smoking allowed inside your home?',
            type: 'yes_no',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: 'pets',
            title: 'Do you or anyone in your household drink alcohol?',
            type: 'yes_no',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: 'drinking',
            title: 'Do you have concerns about your drinking?',
            type: 'yes_no',
            properties: {},
            validations: {
              required: true,
            },
          },
          {
            id: 'drinking-concerns',
            title: 'If yes, please explain why you are concerned',
            type: 'long_text',
            properties: {},
            validations: {
              required_if: {
                field_id: 'drinking',
                value: 'yes',
              },
            },
          },
        ],
      },
    ],
  },
];
