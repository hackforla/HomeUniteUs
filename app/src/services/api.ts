import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchBaseQueryError,
  FetchArgs,
} from '@reduxjs/toolkit/query/react';
import {clearAuthState, tokenReceived} from '../app/authSlice';
import {RootState} from '../app/store';

// Create base query
const baseQuery = fetchBaseQuery({
  baseUrl: 'api/',
  prepareHeaders: (headers, {getState}) => {
    // get token from state
    const token = (getState() as RootState).auth.token;

    // apply authorization token to headers of all requests if token is available
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  // if token is expired, try to refresh it
  if (result.error && result.error.status === 401) {
    // make request to retrieve new tokens
    const refreshResult = await baseQuery('auth/refresh', api, extraOptions);

    if (refreshResult.data) {
      // store new token
      api.dispatch(tokenReceived(refreshResult.data.token));
      // retry the intiail query
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearAuthState());
    }
  }

  return result;
};

// initialize an empty api service that we'll inject endpoints into later as needed
export const api = createApi({
  baseQuery: baseQueryWithReAuth,
  endpoints: () => ({}),
});
