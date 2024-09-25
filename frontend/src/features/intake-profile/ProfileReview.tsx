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
import {format, parseISO} from 'date-fns';

import {OutletContext} from './IntakeProfileGroups';
import {InitialValues} from 'src/pages/intake-profile';
import {Response} from 'src/services/profile';

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
        <Stack sx={{backgroundColor: 'white', px: 3, py: 2}}>
          <Stack sx={{mb: 3}}>
            <Typography sx={{fontSize: 20, fontWeight: 'medium'}} variant="h3">
              Review your profile
            </Typography>
            <Divider />
          </Stack>
          <Stack gap={6}>
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
                            {/* // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore */}
                            {values[group.id][field.id].map((guest, index) => {
                              return (
                                <Box key={guest.id}>
                                  <Typography variant="h6">
                                    Guest {index + 1}
                                  </Typography>
                                  <Stack gap={1}>
                                    <ReviewItem
                                      title={'Name'}
                                      value={guest.name}
                                    />
                                    <ReviewItem
                                      title={'Date of Birth'}
                                      value={format(
                                        parseISO(guest.dob),
                                        'MM/dd/yyyy',
                                      )}
                                    />
                                    <ReviewItem
                                      title={'Relationship'}
                                      value={guest.relationship}
                                    />
                                  </Stack>
                                </Box>
                              );
                            })}
                          </Stack>
                        );
                      } else if (field.type === 'date') {
                        return (
                          <ReviewItem
                            key={field.id}
                            title={field.title}
                            value={format(
                              parseISO(values[group.id][field.id] as string),
                              'MM/dd/yyyy',
                            )}
                          />
                        );
                      } else if (field.type === 'pets') {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        return values[group.id][field.id].map(pet => {
                          return (
                            <ReviewItem
                              key={field.id}
                              title={'Type of Pet'}
                              value={pet.type}
                            />
                          );
                        });
                      } else {
                        return (
                          <ReviewItem
                            key={field.id}
                            title={field.title}
                            value={values[group.id][field.id]}
                          />
                        );
                      }
                    })}
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
};

interface ReviewItemProps {
  title: string;
  value: Response['value'];
}

const ReviewItem = ({title, value}: ReviewItemProps) => {
  return (
    <Box>
      <Typography sx={{fontSize: '18px'}}>{title}</Typography>
      <Typography variant="body1" sx={{fontWeight: 'bold'}}>
        {/* // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore */}
        {value ?? 'N/A'}
      </Typography>
    </Box>
  );
};
