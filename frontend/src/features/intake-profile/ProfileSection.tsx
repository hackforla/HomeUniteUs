import React from 'react';
import {useParams} from 'react-router-dom';
import {CircularProgress, Container, Stack} from '@mui/material';
import {useFormik} from 'formik';

import {
  FieldGroup,
  Response,
  useGetProfileSectionQuery,
  useGetResponsesQuery,
} from '../../services/profile';
import {createInitialValuesForSection} from './helpers';
import {RenderFields} from './RenderFields';

export const ProfileSection = () => {
  const {profileId, sectionId} = useParams();
  const {data: section, isLoading} = useGetProfileSectionQuery(
    {profileId: profileId, sectionId: sectionId},
    {skip: !profileId || !sectionId},
  );
  const {data: responses, isLoading: responsesLoading} = useGetResponsesQuery({
    userId: '1',
  });

  if (
    isLoading ||
    responsesLoading ||
    section === undefined ||
    responses === undefined
  )
    return <CircularProgress />;

  return (
    <Container maxWidth="sm">
      <ProfileSectionFields
        section={section}
        responses={responses.responses}
        sectionId={sectionId ?? ''}
      />
    </Container>
  );
};

interface ProfileSectionFieldsProps {
  section: FieldGroup;
  responses: Response[];
  sectionId: string;
}

const ProfileSectionFields = ({
  section,
  responses,
  sectionId,
}: ProfileSectionFieldsProps) => {
  const {errors, handleChange, setFieldValue, values} = useFormik({
    enableReinitialize: true,
    initialValues: createInitialValuesForSection(section, responses),
    onSubmit: values => {
      console.log(values);
    },
  });

  return (
    <Stack sx={{gap: 3}}>
      {section?.fields.map(field => {
        return (
          <Stack key={field.id} sx={{gap: 4}}>
            <RenderFields
              errors={errors}
              handleChange={handleChange}
              setFieldValue={setFieldValue}
              values={values}
              groupId={sectionId}
              field={field}
            />
          </Stack>
        );
      })}
    </Stack>
  );
};
