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
    user: build.query<User, void>({
      query: () => ({
        url: 'user/',
        method: 'GET',
        withCredentials: true,
      }),
    }),
  }),
});

export {userAPI};

export const {useUserQuery} = userAPI;
