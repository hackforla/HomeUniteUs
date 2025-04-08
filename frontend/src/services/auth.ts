import {api} from './api';
import {User} from './user';

export interface SignUpResponse {
  user: User;
  token: string;
  error?: string;
}

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
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
    signUp: build.mutation<SignUpResponse, SignUpRequest>({
      query: credentials => ({
        url: '/auth/signup',
        method: 'POST',
        withCredentials: true,
        body: credentials,
      }),
    }),
    signIn: build.mutation<SignInResponse, SignInRequest>({
      query: credentials => ({
        url: 'auth/signin',
        method: 'POST',
        withCredentials: true,
        body: credentials,
      }),
    }),
    googleSignUp: build.mutation<TokenResponse, TokenRequest>({
      query: data => {
        const {code, callbackUri} = data;
        return {
          url: `auth/google/sign_up?callback_uri=${callbackUri}`,
          method: 'POST',
          withCredentials: true,
          body: {code},
        };
      },
    }),
    googleSignIn: build.mutation<TokenResponse, TokenRequest>({
      query: data => {
        const {code, callbackUri} = data;
        return {
          url: `auth/google/sign_in?callback_uri=${callbackUri}`,
          method: 'POST',
          withCredentials: true,
          body: {code},
        };
      },
    }),
    forgotPassword: build.mutation<void, ForgotPasswordRequest>({
      query: credentials => ({
        url: 'auth/forgot-password',
        method: 'POST',
        withCredentials: true,
        body: credentials,
      }),
    }),
    confirmForgotPassword: build.mutation<void, ConfirmForgotPasswordRequest>({
      query: credentials => ({
        url: 'auth/forgot-password/confirm',
        method: 'POST',
        withCredentials: true,
        body: credentials,
      }),
    }),
    newPassword: build.mutation<void, NewPasswordRequest>({
      query: credentials => ({
        url: 'auth/new-password',
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
        withCredentials: true,
      }),
    }),
    session: build.mutation<SignInResponse, void>({
      query: () => ({
        url: 'auth/session',
        method: 'GET',
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
        body,
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
  useNewPasswordMutation,
  useGoogleSignUpMutation,
  useGoogleSignInMutation,
  useForgotPasswordMutation,
  useConfirmForgotPasswordMutation,
  useSessionMutation,
  usePrivateQuery,
  useResendConfirmationCodeMutation,
} = authApi;
