import {api} from './api';

export interface UserRole {
  type: 'guest' | 'host' | 'coordinator' | 'admin';
}
export interface User {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

const userAPI = api.injectEndpoints({
  endpoints: build => ({
    currentUser: build.query<User, void>({
      query: () => ({
        url: 'users/current',
        method: 'GET',
        withCredentials: true,
      }),
    }),
  }),
});

export {userAPI};

export const {useCurrentUserQuery} = userAPI;
