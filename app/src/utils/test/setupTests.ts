// Handle test setup here
import '@testing-library/jest-dom';
import nodeFetch, {Request, Response} from 'node-fetch';
import {server} from './server';

Object.assign(global, {fetch: nodeFetch, Request, Response});

beforeAll(() => server.listen({onUnhandledRequest: 'error'}));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
