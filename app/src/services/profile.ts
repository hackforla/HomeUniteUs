import {api} from './api';

export const fieldTypes = [
  'short_text',
  'long_text',
  'number',
  'email',
  'dropdown',
  'multiple_choice',
  'yes_no',
  'additional_guests',
  'pets',
  'contact_method',
] as const;

type FieldTypeTuple = typeof fieldTypes;

export type FieldTypes = FieldTypeTuple[number];

export interface Choice {
  id: string;
  label: string;
}

export interface ReduiredIf {
  field_id: string;
  value: string;
}

export interface Fields {
  id: string;
  title: string;
  type: FieldTypes;
  properties: {
    description?: string;
    randomize?: boolean;
    alphabetical_order?: boolean;
    allow_multiple_selection?: boolean;
    allow_other_choice?: boolean;
    choices?: Choice[];
  };
  validations: {
    required?: boolean;
    max_characters?: number;
    required_if?: ReduiredIf;
  };
  linkedFields: {
    emailFieldId?: string;
    phoneFieldId?: string;
  };
}

export interface FieldGroup {
  id: string;
  title: string;
  fields: Fields[];
}

export interface Guest {
  id: string;
  name: string;
  dob: string;
  relationship: string;
}

export interface Response {
  id: string;
  fieldId: string;
  value: string | Guest[] | Pet[] | undefined;
}

export interface Pet {
  id: string;
}

const injectedRtkApi = api.injectEndpoints({
  endpoints: build => ({
    getProfile: build.query<GetProfileApiResponse, GetProfileApiArg>({
      query: queryArg => ({
        url: `/profile/${queryArg.profileId}`,
      }),
    }),
    getResponses: build.query<
      GetProfileResponsesApiResponse,
      GetProfileResponsesApiArg
    >({
      query: queryArg => ({
        url: `/profile/responses/${queryArg.userId}`,
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

export interface GetProfileResponsesApiResponse {
  responses: Response[];
}

export interface GetProfileResponsesApiArg {
  userId: string | undefined;
}

export const {useGetProfileQuery, useGetResponsesQuery} = injectedRtkApi;
