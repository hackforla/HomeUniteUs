import {Stack, Typography} from '@mui/material';
import {FormContainer} from '../../components/authentication/FormContainer';

export const Sections = () => {
  return (
    <FormContainer>
      <Stack
        spacing={4}
        sx={{justifyContent: 'center', alignItems: 'center', width: '100%'}}
      >
        <Typography variant="h4" sx={{fontWeight: 'bold'}}>
          Profile Sections
        </Typography>
        <Stack
          component="form"
          title="Sections Page"
          sx={{width: '100%', alignItems: 'flex-start'}}
          spacing={4}
        ></Stack>
      </Stack>
    </FormContainer>
  );
};
