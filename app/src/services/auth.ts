import {api} from './api';

export interface User {
  email: string;
}

export interface UserResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

const authApi = api.injectEndpoints({
  endpoints: build => ({
    login: build.mutation<UserResponse, LoginRequest>({
      query: credentials => ({
        url: 'auth/login',
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:4040',
        },
        withCredentials: true,
        body: credentials,
      }),
    }),
    private: build.query<{message: string}, void>({
      query: () => ({
        url: 'auth/private',
        method: 'GET',
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:4040',
        },
        withCredentials: true,
      }),
    }),
  }),
  overrideExisting: false,
});

export {authApi};
export const {useLoginMutation, usePrivateQuery} = authApi;
