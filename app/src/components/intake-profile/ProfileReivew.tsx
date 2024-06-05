import {
  Stack,
  Box,
  Container,
  Typography,
  Divider,
  Button,
} from '@mui/material';
import React from 'react';

export const ProfileReivew = () => {
  return (
    <Container>
      <Stack gap={3}>
        <Typography variant="body1" sx={{color: 'text.primary'}}>
          Please review the details to ensure accuracy, then click &quot;submit
          application&quot; at the bottom to proceed.
        </Typography>
        <Stack gap={3} sx={{backgroundColor: 'white', px: 3, py: 2}}>
          <Stack>
            <Typography sx={{fontSize: 20, fontWeight: 'medium'}} variant="h3">
              Review your profile
            </Typography>
            <Divider />
          </Stack>
          <Stack
            sx={{
              boxShadow: '0px 4px 4px 3px rgba(183, 183, 183, 0.25)',
              px: 3,
              py: 2,
              borderRadius: 1,
            }}
            gap={3}
          >
            <Stack
              sx={{width: '100%'}}
              direction="row"
              justifyContent="space-between"
              alignContent="center"
            >
              <Typography variant="h6">Basic Information</Typography>
              <Button variant="text" color="inherit">
                Edit
              </Button>
            </Stack>
            <Stack gap={1}>
              <Box>
                <Typography sx={{fontSize: '18px'}}>First Name</Typography>
                <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                  John
                </Typography>
              </Box>
              <Box>
                <Typography sx={{fontSize: '18px'}}>Last Name</Typography>
                <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                  Doe
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
};
