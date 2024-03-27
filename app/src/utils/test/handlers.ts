import {http, HttpResponse} from 'msw';

const buildUrl = (path: string) => {
  const baseUrl = `${import.meta.env.VITE_HUU_API_BASE_URL}`;
  return `${baseUrl}${path}`;
};

const handlers = [
  http.post(buildUrl('/auth/forgot_password'), () => {
    return new HttpResponse();
  }),
  http.post(buildUrl('/auth/invite'), () => {
    return new HttpResponse();
  }),
];

export {handlers};
