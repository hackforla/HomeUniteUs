import {api} from './api';

export const fieldTypes = [
  'short_text',
  'long_text',
  'number',
  'date',
  'email',
  'dropdown',
  'yes_no',
  'additional_guests',
  'pets',
  'contact_method',
  'multiple_choice',
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
  linkedFields?: {
    emailFieldId: string;
    phoneFieldId: string;
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
  dob: string | null;
  relationship: string;
}

export interface Response {
  id?: string;
  fieldId: string;
  value: string | Guest[] | Pet[] | undefined;
}

export interface Pet {
  type: string;
  id: string;
}

const injectedRtkApi = api.injectEndpoints({
  endpoints: build => ({
    getProfile: build.query<GetProfileApiResponse, GetProfileApiArg>({
      query: queryArg => ({
        url: `/intake-profile/form/${queryArg.profileId}`,
      }),
    }),
  }),
  overrideExisting: false,
});

export {injectedRtkApi as hostAPI};

export interface GetProfileApiResponse {
  id: string;
  fieldGroups: FieldGroup[];
  responses?: Response[];
}

export interface GetProfileApiArg {
  profileId: string;
}

export const {useGetProfileQuery} = injectedRtkApi;
