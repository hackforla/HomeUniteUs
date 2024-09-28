import {delay, http, HttpResponse} from 'msw';
import {faker} from '@faker-js/faker';
// import {factory, primaryKey} from '@mswjs/data';

import {Fields, GetProfileResponsesApiResponse} from 'src/services/profile';
import {intakeProfiles} from '../db/profile';

// const db = factory({
//   responses: {
//     id: primaryKey(String),
//     userId: String,
//     fieldId: faker.string.uuid,
//   },
// });

interface GetResponsesParams {
  userId: string;
}

export const handlers = [
  http.post('/api/profile/responses', async ({request}) => {
    const responses = await request.json();

    // Save the responses to the database
    console.log('Saving responses:', responses);

    await delay();

    // throw an error
    // return new HttpResponse(null, {status: 400});

    return HttpResponse.json({status: 201});
  }),
  http.get<GetResponsesParams, GetProfileResponsesApiResponse>(
    '/api/profile/responses/:userId',
    async () => {
      const fields = intakeProfiles[0].fieldGroups
        .map(fieldGroup => fieldGroup.fields)
        .flat();

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const responses = fields.map(field => {
        const value = getResponseValue(field);
        return {
          fieldId: field.id,
          value,
        };
      });

      await delay();

      // return a list of filled in responses
      return HttpResponse.json({responses});
      // return an empty list of responses
      // return HttpResponse.json({responses: []});
    },
  ),
  http.get('/api/profile/:profileId', async req => {
    const id = req.params.profileId;
    const profile = intakeProfiles.find(p => p.id === id);

    await delay();

    if (profile) {
      return HttpResponse.json(profile);
    }

    return new HttpResponse(null, {status: 404});
  }),
  http.get('/api/profile/:profileId/:sectionId', async req => {
    const id = req.params.profileId;
    const sectionId = req.params.sectionId;
    const profile = intakeProfiles.find(p => p.id === id);
    const section = profile?.fieldGroups.find(s => s.id === sectionId);

    await delay();

    if (profile) {
      return HttpResponse.json(section);
    }

    return new HttpResponse(null, {status: 404});
  }),
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
