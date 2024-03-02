import {Stack, Typography} from '@mui/material';
import {FormContainer} from 'src/components/authentication';

export const Sections = () => {
  return (
    <FormContainer>
      <Stack
        spacing={4}
        sx={{justifyContent: 'center', alignItems: 'center', width: '100%'}}
      >
        <Stack sx={{justifyContent: 'space-between'}}>
          <Typography variant="h4">Sections</Typography>
          <Typography variant="h6">0 of 11</Typography>
        </Stack>
      </Stack>
    </FormContainer>
  );
};
