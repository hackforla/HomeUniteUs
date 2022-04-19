import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchBaseQueryError,
  FetchArgs,
} from '@reduxjs/toolkit/query/react';
import {tokenReceived} from '../app/authSlice';
import {RootState} from '../app/store';

// Create base query
const baseQuery = fetchBaseQuery({
  baseUrl: 'api/',
  prepareHeaders: (headers, {getState}) => {
    const token = (getState() as RootState).auth.token;

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
  if (result.error && result.error.status === 401) {
    // try to get new token
    const refreshResult = await baseQuery('auth/refresh', api, extraOptions);

    if (refreshResult.data) {
      // store new token
      api.dispatch(tokenReceived(refreshResult.data.token));
      // retry the intiail query
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.log('refresh failed. logout');
      //logout
      // api.dispatch(loggedOut());
    }
  }

  return result;
};

// initialize an empty api service that we'll inject endpoints into later as needed
export const api = createApi({
  baseQuery: baseQueryWithReAuth,
  endpoints: () => ({}),
});
