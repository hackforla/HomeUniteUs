import {FieldGroup} from 'src/views/constants/intakeProfile';
import {api} from './api';

const injectedRtkApi = api.injectEndpoints({
  endpoints: build => ({
    getProfile: build.query<GetProfileApiResponse, GetProfileApiArg>({
      query: queryArg => ({
        url: `/profile/${queryArg.profileId}`,
      }),
    }),
  }),
  overrideExisting: false,
});

export {injectedRtkApi as hostAPI};

interface GetProfileApiResponse {
  id: string;
  fieldGroups: FieldGroup[];
}

interface GetProfileApiArg {
  profileId: string;
}

export const {useGetProfileQuery} = injectedRtkApi;
