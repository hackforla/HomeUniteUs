import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchBaseQueryError,
  FetchArgs,
} from '@reduxjs/toolkit/query/react';
import {setCredentials, tokenReceived} from '../app/authSlice';
import {RootState} from '../app/store';

// Create base query
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_HUU_API_BASE_URL,
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
      // if we made it here, then data is not undefined, but its type is unknown
      //    due to current redux generator output.
      //    TODO: make this nicer and more robust, i.e. wrap the class or call
      //        to give us a flexible but strongly-typed interface to rely on
      const {data} = refreshResult as {data: {token: string}};
      // store new token
      // api.dispatch(tokenReceived(refreshResult.data.token));
      api.dispatch(tokenReceived(data.token));
      // retry the intiail query
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(setCredentials({user: null, token: null}));
    }
  }

  return result;
};

// initialize an empty api service that we'll inject endpoints into later as needed
export const api = createApi({
  baseQuery: baseQueryWithReAuth,
  tagTypes: ['Hosts'],
  endpoints: () => ({}),
});
