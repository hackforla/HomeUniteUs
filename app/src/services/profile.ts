import {Answer, FieldGroup} from 'src/views/constants/intakeProfile';
import {api} from './api';

const injectedRtkApi = api.injectEndpoints({
  endpoints: build => ({
    getProfile: build.query<GetProfileApiResponse, GetProfileApiArg>({
      query: queryArg => ({
        url: `/profile/${queryArg.profileId}`,
      }),
    }),
    getAnswers: build.query<
      GetProfileAnswersApiResponse,
      GetProfileAnswersApiArg
    >({
      query: queryArg => ({
        url: `/profile/answers/${queryArg.userId}`,
      }),
    }),
  }),
  overrideExisting: false,
});

export {injectedRtkApi as hostAPI};

export interface GetProfileApiResponse {
  id: string;
  fieldGroups: FieldGroup[];
}

export interface GetProfileApiArg {
  profileId: string | undefined;
}

export interface GetProfileAnswersApiResponse {
  answers: Answer[];
}

export interface GetProfileAnswersApiArg {
  userId: string | undefined;
}

export const {useGetProfileQuery, useGetAnswersQuery} = injectedRtkApi;
