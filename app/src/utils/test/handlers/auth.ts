import {http, HttpResponse} from 'msw';

export const handlers = [
  http.post('/api/auth/forgot_password', () => {
    return new HttpResponse();
  }),
  http.post('/api/auth/invite', () => {
    return new HttpResponse();
  }),
];
