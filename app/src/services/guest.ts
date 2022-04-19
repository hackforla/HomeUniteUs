import {api} from './api';
const injectedRtkApi = api.injectEndpoints({
  endpoints: build => ({
    deleteGuest: build.mutation<DeleteGuestApiResponse, DeleteGuestApiArg>({
      query: () => ({url: `/guests`, method: 'DELETE'}),
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
  }),
  overrideExisting: false,
});
export {injectedRtkApi as guestAPI};
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
export const {
  useDeleteGuestMutation,
  useListGuestsQuery,
  useCreateGuestMutation,
  useUpdateGuestMutation,
  useShowGuestByIdQuery,
  useUploadGuestImageMutation,
} = injectedRtkApi;
