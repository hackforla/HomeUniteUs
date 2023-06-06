import {rest} from 'msw';

const baseUrl = 'http://localhost:4040/api';

const handlers = [
  rest.post(`${baseUrl}/auth/forgot_password`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];

export {handlers};
