import {http, HttpResponse} from 'msw';

const handlers = [
  http.post(
    `${import.meta.env.VITE_HUU_API_BASE_URL}/auth/forgot_password`,
    () => {
      return new HttpResponse();
    },
  ),
  http.post(`${import.meta.env.VITE_HUU_API_BASE_URL}/auth/invite`, () => {
    return new HttpResponse();
  }),
];

export {handlers};
