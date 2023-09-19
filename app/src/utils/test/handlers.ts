import {rest} from 'msw';

const handlers = [
  rest.post(/.*\/api\/auth\/forgot_password$/, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];

export {handlers};
