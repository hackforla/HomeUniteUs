import {rest} from 'msw';

const basePath = 'http://localhost:4040';

const handlers = [
  rest.post(`${basePath}/api/auth/forgot_password/confirm`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];

export {handlers};
