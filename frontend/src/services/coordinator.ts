import {api} from './api';
import {faker} from '@faker-js/faker';

/** Specifies information needed to invite a new `Guest` user to create an account */
export interface InviteGuestRequest {
  firstName: string;
  lastName: string;
  email: string;
}

/** Display data for a single user within the `CoordinatorDashboard` module */
export interface DashboardDataItem {
  id: number;
  userId: string;
  userName: string;
  caseStatus: string;
  coordinatorName: string;
  userType: 'GUEST' | 'HOST' | 'COORDINATOR';
  lastUpdated: string;
  notes: string[];

  substance_abuse: {
    cigarette: boolean;
    alcohol: boolean;
    other: boolean;
  };
}

/** Error model for admin-level API responses */
export interface AdminApiError {
  message: string;
  items: string[];
}

/** A container class for all data relevant to initial `CoordinatorDashboard` display components */
export interface DashboardDataResponse {
  dashboardItems: Array<DashboardDataItem>;
}

const coordinatorApi = api.injectEndpoints({
  endpoints: build => ({
    /**
     * Initiates the invite process for a `Guest` on behalf of a `Coordinator` or `Admin`
     **/
    inviteGuest: build.mutation<void, InviteGuestRequest>({
      query: (req: InviteGuestRequest) => ({
        url: 'auth/invite',
        method: 'POST',
        withCredentials: true,
        body: req,
      }),
    }),
    /**
     * Fetch all registered `Guest`, `Host` and `Coordinator` users
     **/
    getAllDashboardData: build.mutation<DashboardDataResponse, void>({
      query: () => ({
        url: 'coordinator/dashboard/all',
        method: 'GET',
        withCredentials: true,
      }),
    }),
    /**
     * Delete a user entirely from the system. This is an
     *    admin-only method intended for debugging purposes only
     **/
    adminDeleteUser: build.mutation<void, number>({
      query: userId => ({
        url: `/users/${userId}`,
        method: 'DELETE',
        withCredentials: true,
      }),
    }),
  }),
});

export const fakeCandidates: DashboardDataItem[] = [];
for (let n = 0; n < 7; n++) {
  fakeCandidates.push({
    id: n,
    userId: faker.person.firstName(),
    userName: faker.person.fullName(),
    caseStatus: faker.helpers.arrayElement([
      'In Review',
      'Application Started',
      'Intake Profile Started',
    ]),
    coordinatorName: faker.person.fullName(),
    userType: faker.helpers.arrayElement(['GUEST', 'HOST', 'COORDINATOR']),
    lastUpdated: faker.date.past().toISOString(),
    notes: [faker.word.words(), faker.word.words(), faker.word.words()],

    substance_abuse: {
      cigarette: faker.helpers.arrayElement([true, false]),
      alcohol: faker.helpers.arrayElement([true, false]),
      other: faker.helpers.arrayElement([true, false]),
    },
  });
}

export const {
  useInviteGuestMutation,
  useGetAllDashboardDataMutation,
  useAdminDeleteUserMutation,
} = coordinatorApi;
