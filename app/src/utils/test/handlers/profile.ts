import {http, HttpResponse} from 'msw';
import {intakeProfiles} from '../db/intakeProfiles';

const buildUrl = (path: string) => {
  const baseUrl = `${import.meta.env.VITE_HUU_API_BASE_URL}`;
  return `${baseUrl}${path}`;
};

export const handlers = [
  http.post(buildUrl('/api/profile/:profileId'), req => {
    const id = req.params.profileId;
    const profile = intakeProfiles.find(p => p.id === id);

    if (profile) {
      return HttpResponse.json({
        body: profile,
      });
    }

    return new HttpResponse(null, {status: 404});
  }),

  http.post(buildUrl('/api/profile/answers/:userId'), () => {
    return new HttpResponse();
  }),
];
