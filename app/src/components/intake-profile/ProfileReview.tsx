import React from 'react';
import {
  Stack,
  Box,
  Container,
  Typography,
  Divider,
  Button,
} from '@mui/material';
import {Link, useOutletContext} from 'react-router-dom';
import {useFormikContext} from 'formik';

import {OutletContext} from './IntakeProfileGroups';
import {InitialValues} from 'src/views/IntakeProfile';

export const ProfileReview = () => {
  const {fieldGroups} = useOutletContext<OutletContext>();
  const {values} = useFormikContext<InitialValues>();

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
          {fieldGroups.map(group => {
            return (
              <Stack
                key={group.id}
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
                  <Typography variant="h6">{group.title}</Typography>
                  <Button
                    variant="text"
                    to={`/guest/profile/1/group/${group.id}`}
                    component={Link}
                    color="inherit"
                  >
                    Edit
                  </Button>
                </Stack>
                <Stack gap={2}>
                  {group.fields.map(field => {
                    if (field.type === 'additional_guests') {
                      return (
                        <Stack key={field.id}>
                          <Typography sx={{fontSize: '18px'}}>
                            {field.title}
                          </Typography>
                          {values[group.id][field.id].map((guest, index) => {
                            return (
                              <Box key={guest.id}>
                                <Typography variant="h6">
                                  Guest {index + 1}
                                </Typography>
                                <Stack gap={1}>
                                  <Box>
                                    <Typography sx={{fontSize: '18px'}}>
                                      Name
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      sx={{fontWeight: 'bold'}}
                                    >
                                      {guest.name}
                                    </Typography>
                                  </Box>
                                  <Box>
                                    <Typography sx={{fontSize: '18px'}}>
                                      Date of Birth
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      sx={{fontWeight: 'bold'}}
                                    >
                                      {guest.dob}
                                    </Typography>
                                  </Box>
                                  <Box>
                                    <Typography sx={{fontSize: '18px'}}>
                                      Relationship
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      sx={{fontWeight: 'bold'}}
                                    >
                                      {guest.relationship}
                                    </Typography>
                                  </Box>
                                </Stack>
                              </Box>
                            );
                          })}
                        </Stack>
                      );
                    } else if (field.type === 'pets') {
                      return values[group.id][field.id].map(pet => {
                        return (
                          <Box key={field.id}>
                            <Typography sx={{fontSize: '18px'}}>
                              Type of Pet
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{fontWeight: 'bold'}}
                            >
                              {pet.type ?? 'N/A'}
                            </Typography>
                          </Box>
                        );
                      });
                    } else {
                      return (
                        <Box key={field.id}>
                          <Typography sx={{fontSize: '18px'}}>
                            {field.title}
                          </Typography>
                          <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                            {values[group.id][field.id] ?? 'N/A'}
                          </Typography>
                        </Box>
                      );
                    }
                  })}
                </Stack>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </Container>
  );
};
