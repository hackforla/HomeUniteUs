import {api} from './api';
const injectedRtkApi = api.injectEndpoints({
  endpoints: build => ({
    deleteHost: build.mutation<DeleteHostApiResponse, DeleteHostApiArg>({
      query: () => ({url: `/hosts`, method: 'DELETE'}),
    }),
    listHosts: build.query<ListHostsApiResponse, ListHostsApiArg>({
      query: queryArg => ({url: `/hosts`, params: {limit: queryArg.limit}}),
    }),
    createHost: build.mutation<CreateHostApiResponse, CreateHostApiArg>({
      query: () => ({url: `/hosts`, method: 'POST'}),
    }),
    updateHost: build.mutation<UpdateHostApiResponse, UpdateHostApiArg>({
      query: queryArg => ({url: `/hosts`, method: 'PUT', body: queryArg.host}),
    }),
    showHostById: build.query<ShowHostByIdApiResponse, ShowHostByIdApiArg>({
      query: queryArg => ({url: `/hosts/${queryArg.hostId}`}),
    }),
    uploadHostImage: build.mutation<
      UploadHostImageApiResponse,
      UploadHostImageApiArg
    >({
      query: queryArg => ({
        url: `/hosts/${queryArg.hostId}/uploadImage`,
        method: 'POST',
        body: queryArg.body,
        params: {additionalMetadata: queryArg.additionalMetadata},
      }),
    }),
  }),
  overrideExisting: false,
});
export {injectedRtkApi as hostAPI};
export type DeleteHostApiResponse = unknown;
export type DeleteHostApiArg = {
  /** host id to delete */
  hostId: number;
};
export type ListHostsApiResponse = /** status 200 successful operation */ Hosts;
export type ListHostsApiArg = {
  /** How many items to return at one time (max 100) */
  limit?: number;
};
export type CreateHostApiResponse = /** status 201 Null response */ undefined;
export type CreateHostApiArg = void;
export type UpdateHostApiResponse = /** status 200 Successful operation */ Host;
export type UpdateHostApiArg = {
  /** Update host */
  host: Host;
};
export type ShowHostByIdApiResponse =
  /** status 200 Expected response to a valid request */ Host;
export type ShowHostByIdApiArg = {
  /** The id of the host to retrieve */
  hostId: string;
};
export type UploadHostImageApiResponse =
  /** status 200 successful operation */ ApiResponse;
export type UploadHostImageApiArg = {
  /** ID of host to update */
  hostId: string;
  /** Additional Metadata */
  additionalMetadata?: string;
  body: Blob;
};
export type Host = {
  id: number;
  name: string;
  photoUrls?: string[];
  tag?: string;
};
export type Hosts = Host[];
export type ApiResponse = {
  code?: number;
  message?: string;
  type?: string;
};
export const {
  useDeleteHostMutation,
  useListHostsQuery,
  useCreateHostMutation,
  useUpdateHostMutation,
  useShowHostByIdQuery,
  useUploadHostImageMutation,
} = injectedRtkApi;
