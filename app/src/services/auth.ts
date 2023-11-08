import {api} from './api';

export interface User {
  email: string;
}

export interface UserResponse {
  user: User;
}

export interface SignUpHostResponse {
  user: User;
  token: string;
}

export interface SignUpHostRequest {
  email: string;
  password: string;
}
export interface SignUpCoordinatorResponse {
  user: User;
  token: string;
}

export interface SignUpCoordinatorRequest {
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

export interface NewPasswordRequest {
  password: string;
  confirmPassword: string;
  userId: string | null;
  sessionId: string | null;
}

export interface SignOutResponse {
  message: string;
}

export interface VerificationRequest {
  email: string;
  code: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ConfirmForgotPasswordRequest {
  email: string;
  password: string;
  code: string;
}

export interface TokenRequest {
  code: string;
  callbackUri: string;
}

export interface TokenResponse {
  token: string;
  user: User;
}

export interface ResendConfirmationCodeRequest {
  email: string;
}

export interface ResendConfirmationCodeResponse {
  message: string;
}
// /auth/resend_confirmation_code

const authApi = api.injectEndpoints({
  endpoints: build => ({
    signUpHost: build.mutation<SignUpHostResponse, SignUpHostRequest>({
      query: credentials => ({
        url: '/auth/signup/host',
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:4040',
        },
        withCredentials: true,
        body: credentials,
      }),
    }),
    // prettier-ignore
    signUpCoordinator: build.mutation<SignUpCoordinatorResponse, SignUpCoordinatorRequest>({
      query: credentials => ({
        url: '/auth/signup/coordinator',
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
    getToken: build.mutation<TokenResponse, TokenRequest>({
      query: data => {
        const {code, callbackUri} = data;
        return {
          url: `auth/token?callback_uri=${callbackUri}`,
          method: 'POST',
          withCredentials: true,
          body: {code},
        };
      },
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
    forgotPassword: build.mutation<void, ForgotPasswordRequest>({
      query: credentials => ({
        url: 'auth/forgot_password',
        method: 'POST',
        withCredentials: true,
        body: credentials,
      }),
    }),
    confirmForgotPassword: build.mutation<void, ConfirmForgotPasswordRequest>({
      query: credentials => ({
        url: 'auth/forgot_password/confirm',
        method: 'POST',
        withCredentials: true,
        body: credentials,
      }),
    }),
    newPassword: build.mutation<void, NewPasswordRequest>({
      query: credentials => ({
        url: 'auth/initialInvite',
        method: 'POST',
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
        url: 'auth/session',
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
    resendConfirmationCode: build.mutation<
      ResendConfirmationCodeResponse,
      ResendConfirmationCodeRequest
    >({
      query: body => ({
        url: 'auth/resend_confirmation_code',
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:4040',
        },
        body,
        withCredentials: true,
      }),
    }),
  }),
  overrideExisting: false,
});

export {authApi};
export const {
  useSignUpHostMutation,
  useSignUpCoordinatorMutation,
  useSignInMutation,
  useSignOutMutation,
  useVerificationMutation,
  useNewPasswordMutation,
  useGetTokenMutation,
  useForgotPasswordMutation,
  useConfirmForgotPasswordMutation,
  useSessionMutation,
  useUserQuery,
  usePrivateQuery,
  useResendConfirmationCodeMutation,
} = authApi;
