import {setupServer} from 'msw/node';
import {handlers as authHandlers} from './handlers/auth';
import {handlers as profileHandlers} from './handlers/profile';

const server = setupServer(...authHandlers, ...profileHandlers);

server.events.on('request:start', ({request}) => {
  console.log('Outgoing:', request.method, request.url);
});

export {server};
