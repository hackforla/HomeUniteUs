import React from 'react';
import {useParams} from 'react-router-dom';
import {Container} from '@mui/material';
import {useFormik} from 'formik';

import {
  useGetProfileSectionQuery,
  useGetResponsesQuery,
} from '../../services/profile';
import {createInitialValuesForSection} from './helpers';

export const ProfileSection = () => {
  const {profileId, sectionId} = useParams();
  const {data: section, isLoading} = useGetProfileSectionQuery(
    {profileId: profileId, sectionId: sectionId},
    {skip: !profileId || !sectionId},
  );
  const {data: responses, isLoading: responsesLoading} = useGetResponsesQuery({
    userId: '1',
  });

  console.log({section, responses});

  const formik = useFormik({
    initialValues:
      !isLoading && !responsesLoading && section && responses
        ? createInitialValuesForSection(section, responses.responses)
        : {},
    onSubmit: values => {
      console.log(values);
    },
  });

  console.log(formik.values);

  return (
    <Container maxWidth="sm">
      <div>This is a section</div>
    </Container>
  );
};
