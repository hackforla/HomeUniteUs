import {Stack, Typography} from '@mui/material';
import {FormContainer} from '../../components/authentication/FormContainer';
import {SectionBox} from '../../components/common/SectionBox';

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
          <SectionBox
            complete={true}
            innerText={'Basic Information'}
            route={'basic'}
          />
        </Stack>
      </Stack>
    </FormContainer>
  );
};
