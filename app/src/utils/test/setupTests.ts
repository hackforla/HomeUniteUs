// Handle test setup here
import '@testing-library/jest-dom';
import 'whatwg-fetch';
import {server} from './server';

beforeAll(() => server.listen({onUnhandledRequest: 'error'}));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
