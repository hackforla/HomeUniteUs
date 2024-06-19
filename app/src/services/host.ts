import {api} from './api';
const injectedRtkApi = api.injectEndpoints({
  endpoints: build => ({
    getHosts: build.query<GetHostsApiResponse, void>({
      query: () => ({url: `/host`}),
      providesTags: (result = []) => [
        ...result.map(({id}) => ({type: 'Hosts', id}) as const),
        {type: 'Hosts' as const, id: 'LIST'},
      ],
    }),
    createHost: build.mutation<CreateHostApiResponse, CreateHostApiArg>({
      query: queryArg => ({url: `/host`, method: 'POST', body: queryArg.body}),
      invalidatesTags: [{type: 'Hosts', id: 'LIST'}],
    }),
  }),
  overrideExisting: false,
});

export {injectedRtkApi as hostAPI};
export type Host = {id: number; name: string};
export type GetHostsApiResponse = /** status 200 An array of hosts */ Host[];
export type GetHostsApiArg = void;
export type CreateHostApiResponse =
  /** status 200 Succes created host */ ApiResponse;
export type CreateHostApiArg = {
  body: {
    name: string;
  };
};
export type ApiResponse = {
  id?: number;
  name?: string;
};
export const {useGetHostsQuery, useCreateHostMutation} = injectedRtkApi;
