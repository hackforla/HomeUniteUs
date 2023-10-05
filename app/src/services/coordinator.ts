import {api} from './api';

export interface InviteGuestRequest {
  fullName: string;
  email: string;
}

const coordinatorApi = api.injectEndpoints({
  endpoints: build => ({
    inviteGuest: build.mutation<void, InviteGuestRequest>({
      query: credentials => ({
        url: 'auth/invite',
        method: 'POST',
        withCredentials: true,
        body: credentials,
      }),
    }),
  }),
});

export const {useInviteGuestMutation} = coordinatorApi;
