import {emptySplitApi as api} from './emptyApi';
const injectedRtkApi = api.injectEndpoints({
  endpoints: build => ({
    deleteGuest: build.mutation<DeleteGuestApiResponse, DeleteGuestApiArg>({
      query: queryArg => ({url: `/guests`, method: 'DELETE'}),
    }),
    listGuests: build.query<ListGuestsApiResponse, ListGuestsApiArg>({
      query: queryArg => ({url: `/guests`, params: {limit: queryArg.limit}}),
    }),
    createGuest: build.mutation<CreateGuestApiResponse, CreateGuestApiArg>({
      query: () => ({url: `/guests`, method: 'POST'}),
    }),
    updateGuest: build.mutation<UpdateGuestApiResponse, UpdateGuestApiArg>({
      query: queryArg => ({
        url: `/guests`,
        method: 'PUT',
        body: queryArg.guest,
      }),
    }),
    showGuestById: build.query<ShowGuestByIdApiResponse, ShowGuestByIdApiArg>({
      query: queryArg => ({url: `/guests/${queryArg.guestId}`}),
    }),
    uploadGuestImage: build.mutation<
      UploadGuestImageApiResponse,
      UploadGuestImageApiArg
    >({
      query: queryArg => ({
        url: `/guests/${queryArg.guestId}/uploadImage`,
        method: 'POST',
        body: queryArg.body,
        params: {additionalMetadata: queryArg.additionalMetadata},
      }),
    }),
    deleteHost: build.mutation<DeleteHostApiResponse, DeleteHostApiArg>({
      query: queryArg => ({url: `/hosts`, method: 'DELETE'}),
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
export {injectedRtkApi as api};
export type DeleteGuestApiResponse = unknown;
export type DeleteGuestApiArg = {
  /** guest id to delete */
  guestId: number;
};
export type ListGuestsApiResponse = /** status 200 successful operation */ Guests;
export type ListGuestsApiArg = {
  /** How many items to return at one time (max 100) */
  limit?: number;
};
export type CreateGuestApiResponse = /** status 201 Null response */ undefined;
export type CreateGuestApiArg = void;
export type UpdateGuestApiResponse = /** status 200 Successful operation */ Guest;
export type UpdateGuestApiArg = {
  /** Update guest */
  guest: Guest;
};
export type ShowGuestByIdApiResponse = /** status 200 Expected response to a valid request */ Guest;
export type ShowGuestByIdApiArg = {
  /** The id of the guest to retrieve */
  guestId: string;
};
export type UploadGuestImageApiResponse = /** status 200 successful operation */ ApiResponse;
export type UploadGuestImageApiArg = {
  /** ID of guest to update */
  guestId: string;
  /** Additional Metadata */
  additionalMetadata?: string;
  body: Blob;
};
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
export type ShowHostByIdApiResponse = /** status 200 Expected response to a valid request */ Host;
export type ShowHostByIdApiArg = {
  /** The id of the host to retrieve */
  hostId: string;
};
export type UploadHostImageApiResponse = /** status 200 successful operation */ ApiResponse;
export type UploadHostImageApiArg = {
  /** ID of host to update */
  hostId: string;
  /** Additional Metadata */
  additionalMetadata?: string;
  body: Blob;
};
export type Guest = {
  id: number;
  name: string;
  photoUrls?: string[];
  tag?: string;
};
export type Guests = Guest[];
export type ApiResponse = {
  code?: number;
  message?: string;
  type?: string;
};
export type Host = {
  id: number;
  name: string;
  photoUrls?: string[];
  tag?: string;
};
export type Hosts = Host[];
export const {
  useDeleteGuestMutation,
  useListGuestsQuery,
  useCreateGuestMutation,
  useUpdateGuestMutation,
  useShowGuestByIdQuery,
  useUploadGuestImageMutation,
  useDeleteHostMutation,
  useListHostsQuery,
  useCreateHostMutation,
  useUpdateHostMutation,
  useShowHostByIdQuery,
  useUploadHostImageMutation,
} = injectedRtkApi;
