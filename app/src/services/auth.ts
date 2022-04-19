import {api} from './api';

export interface User {
  email: string;
}

export interface UserResponse {
  user: User;
}

export interface SignInResponse {
  user: User;
  token: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

const authApi = api.injectEndpoints({
  endpoints: build => ({
    signIn: build.mutation<SignInResponse, SignInRequest>({
      query: credentials => ({
        url: 'auth/signin',
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
    user: build.query<UserResponse, void>({
      query: () => ({
        url: 'auth/user',
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
export const {useSignInMutation, useUserQuery, usePrivateQuery} = authApi;
