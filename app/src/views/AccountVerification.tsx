import React from 'react';
import {styled} from '@mui/system';
import {Stack, Typography} from '@mui/material';

import {VerificationRequest, useVerificationMutation} from '../services/auth';
import {AccountVerificationForm} from '../components/authentication/AccountVerificationForm';

export const AccountVerification = () => {
  const [verify] = useVerificationMutation();

  const handleVerification = async ({email, code}: VerificationRequest) => {
    try {
      const response = await verify({
        email,
        code,
      }).unwrap();
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <PageContainer>
      <FormContainer>
        <FormHeader variant="h4">Verify your account</FormHeader>
        <AccountVerificationForm onSubmit={handleVerification} />
      </FormContainer>
    </PageContainer>
  );
};

const PageContainer = styled('div')(({theme}) => ({
  minHeight: '100vh',
  minWidth: '100vw',
  backgroundColor: theme.palette.grey[100],
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const FormContainer = styled(Stack)(({theme}) => ({
  maxWidth: '550px',
  minWidth: '350px',
  alignItems: 'center',
  padding: '2rem',
  border: '1px solid #e0e0e0',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#fff',
  margin: '0 16px',
}));

const FormHeader = styled(Typography)({
  textAlign: 'center',
  marginBottom: '16px',
  fontWeight: 600,
});
