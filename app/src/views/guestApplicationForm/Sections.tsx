import {Box, Stack, Typography} from '@mui/material';
import {FormContainer} from '../../components/authentication/FormContainer';
import {CircleOutlined} from '@mui/icons-material';

export const Sections = () => {
  return (
    <FormContainer>
      <Stack spacing={4} sx={{width: '100%'}}>
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography sx={{fontSize: 20, fontWeight: 'medium'}}>
            Profile Sections
          </Typography>
          <Typography sx={{fontSize: 14, fontWeight: 'medium'}}>
            0 of 11
          </Typography>
        </Stack>
        <Stack sx={{display: 'flex', gap: 1}}>
          <Box
            sx={{
              borderRadius: 2,
              backgroundColor: 'white',
              height: 56,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingInline: 3,
            }}
          >
            <Typography sx={{fontSize: 16, fontWeight: 'medium'}}>
              Basic Information
            </Typography>
            <CircleOutlined color="action" />
          </Box>
        </Stack>
      </Stack>
    </FormContainer>
  );
};
