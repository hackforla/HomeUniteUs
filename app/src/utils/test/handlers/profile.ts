import {http, HttpResponse} from 'msw';
import {intakeProfiles} from '../db/profile';

export const handlers = [
  http.get('/api/profile/:profileId', req => {
    const id = req.params.profileId;
    const profile = intakeProfiles.find(p => p.id === id);

    if (profile) {
      return HttpResponse.json({
        profile,
      });
    }

    return new HttpResponse(null, {status: 404});
  }),

  http.get('api/profile/answers/:userId', () => {
    return new HttpResponse();
  }),
];
