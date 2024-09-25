import {http, HttpResponse} from 'msw';
import {intakeProfiles} from '../db/profile';
import {faker} from '@faker-js/faker';
import {Fields, GetProfileResponsesApiResponse} from 'src/services/profile';

interface GetResponsesParams {
  userId: string;
}

export const handlers = [
  http.get('/api/profile/:profileId', req => {
    const id = req.params.profileId;
    const profile = intakeProfiles.find(p => p.id === id);

    if (profile) {
      return HttpResponse.json(profile);
    }

    return new HttpResponse(null, {status: 404});
  }),

  http.get<GetResponsesParams, GetProfileResponsesApiResponse>(
    '/api/profile/responses/:userId',
    () => {
      const fields = intakeProfiles[0].fieldGroups
        .map(fieldGroup => fieldGroup.fields)
        .flat();

      const responses = fields.map(field => {
        const value = getResponseValue(field);
        return {
          fieldId: field.id,
          value,
        };
      });

      // return a list of filled in responses
      return HttpResponse.json({responses});
      // return an empty list of responses
      // return HttpResponse.json({responses: []});
    },
  ),
];

// Provide a fake response value based on the field type
const getResponseValue = (field: Fields) => {
  switch (field.type) {
    case 'short_text':
      return faker.lorem.words(4);
    case 'long_text':
      return faker.lorem.paragraph();
    case 'date':
      return faker.date.past().toISOString();
    case 'dropdown':
      if (!field.properties.choices) {
        throw new Error(
          'No choices object found on dropdown field while generating response value',
        );
      }

      return field.properties.choices[1].label;
    case 'number':
      return faker.phone.number();
    case 'pets':
      return [
        {
          type: 'Dog',
        },
      ];
    case 'additional_guests':
      return [
        {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          dob: faker.date.past().toISOString(),
          relationship: 'spouse',
        },
        {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          dob: faker.date.past().toISOString(),
          relationship: 'spouse',
        },
      ];
    case 'email':
      return faker.internet.email();
    case 'yes_no':
      return 'no';
    default:
      return faker.lorem.words(4);
  }
};
