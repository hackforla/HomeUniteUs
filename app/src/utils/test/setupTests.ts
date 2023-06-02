// Handle test setup here
import '@testing-library/jest-dom';
import {server} from './server';

beforeAll(() => server.listen({onUnhandledRequest: 'error'}));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
