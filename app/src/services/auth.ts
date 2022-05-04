import {api} from './api';

export interface User {
  email: string;
}

export interface UserResponse {
  user: User;
}

export interface SignUpResponse {
  user: User;
  token: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  user: User;
  token: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignOutResponse {
  message: string;
}

export interface VerificationRequest {
  email: string;
  code: string;
}

const authApi = api.injectEndpoints({
  endpoints: build => ({
    signUp: build.mutation<SignUpResponse, SignUpRequest>({
      query: credentials => ({
        url: '/auth/signup',
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:4040',
        },
        withCredentials: true,
        body: credentials,
      }),
    }),
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
    verification: build.mutation<void, VerificationRequest>({
      query: credentials => ({
        url: 'auth/verify',
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:4040',
        },
        withCredentials: true,
        body: credentials,
      }),
    }),
    signOut: build.mutation<SignOutResponse, void>({
      query: () => ({
        url: 'auth/signout',
        method: 'POST',
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
    session: build.mutation<SignInResponse, void>({
      query: () => ({
        url: 'auth/current_session',
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
export const {
  useSignUpMutation,
  useSignInMutation,
  useSignOutMutation,
  useVerificationMutation,
  useSessionMutation,
  useUserQuery,
  usePrivateQuery,
} = authApi;
