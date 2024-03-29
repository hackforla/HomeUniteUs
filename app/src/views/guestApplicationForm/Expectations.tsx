import {Typography, Stack} from '@mui/material';
import React from 'react';
import {FormContainer} from '../../components/authentication';

export const Expectations = () => {
  return (
    <FormContainer>
      <Stack
        spacing={4}
        sx={{justifyContent: 'center', alignItems: 'center', width: '100%'}}
      >
        <Typography variant="h5" sx={{fontWeight: 'bold'}}>
          Guest Minimum Expectations
        </Typography>
        <Stack
          component="form"
          title="Expectations Page"
          sx={{width: '100%', alignItems: 'flex-start'}}
          spacing={4}
        >
          <Typography variant="body1">
            <ol>
              <li>Guest is between 18-25 years old</li>
              <li>
                Guest is enrolled in a Rapid ReHousing Program or is receiving a
                Housing Choice (Section 8) voucher
              </li>
              <li>Guest is interested in short-term, in-home shelter</li>
              <li>
                Guest actively engages in Host Home onboarding procedures
                including their own background check, interview, and training
              </li>
              <li>
                Guest is interested in seeking employment or educational
                opportunities
              </li>
              <li>Guest participates in the matching process with SPY staff</li>
              <li>
                Guest completes weekly to bi-weekly home visits with the Host
                Home Coordinator
              </li>
              <li>Guest engages in weekly case-management with SPY staff</li>
              <li>
                Guest commits to no overnight guests and no substance use in the
                Host Home and to abide by the specific house guidelines in their
                Host-Guest contract
              </li>
              <li>
                Guest commits to conducting themselves respectfully and
                thoughtfully, and to communicating openly and often with Host
                and SPY staff
              </li>
            </ol>
          </Typography>
        </Stack>
      </Stack>
    </FormContainer>
  );
};
