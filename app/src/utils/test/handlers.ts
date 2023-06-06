import {rest} from 'msw';

const handlers = [
  rest.post(`/auth/forgot_password/confirm`, (req, res, ctx) => {
    console.log('reset password', req);
    return res(ctx.status(200));
  }),
];

export {handlers};
