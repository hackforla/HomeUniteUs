import {api} from './api';
const injectedRtkApi = api.injectEndpoints({
  endpoints: build => ({
    getHosts: build.query<GetHostsApiResponse, GetHostsApiArg>({
      query: () => ({url: `/host`}),
    }),
    createHost: build.mutation<CreateHostApiResponse, CreateHostApiArg>({
      query: queryArg => ({url: `/host`, method: 'POST', body: queryArg.body}),
    }),
  }),
  overrideExisting: false,
});

export {injectedRtkApi as hostAPI};
export type Host = {id: number; name: string};
export type GetHostsApiResponse =
  /** status 200 An array of hosts */ Array<Host>;
export type GetHostsApiArg = void;
export type CreateHostApiResponse =
  /** status 200 Succes created host */ ApiResponse;
export type CreateHostApiArg = {
  body: {
    name: string;
  };
};
export type ApiResponse = {
  code?: number;
  message?: string;
  type?: string;
};
export const {useGetHostsQuery, useCreateHostMutation} = injectedRtkApi;
