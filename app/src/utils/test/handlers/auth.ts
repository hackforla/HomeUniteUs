import {http, HttpResponse} from 'msw';

export const handlers = [
  http.post('/auth/forgot_password', () => {
    return new HttpResponse();
  }),
  http.post('/auth/invite', () => {
    return new HttpResponse();
  }),
];
