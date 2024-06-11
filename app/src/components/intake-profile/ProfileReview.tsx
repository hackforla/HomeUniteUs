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
                <Stack gap={1}>
                  {group.fields.map(field => {
                    return (
                      <Box key={field.id}>
                        <Typography sx={{fontSize: '18px'}}>
                          {field.title}
                        </Typography>
                        <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                          {typeof values[group.id][field.id] === 'string'
                            ? values[group.id][field.id]
                            : 'N/A'}
                        </Typography>
                      </Box>
                    );
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
