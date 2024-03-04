import {Stack, Typography} from '@mui/material';
import {FormContainer} from '../../components/authentication/FormContainer';
import {SectionBox} from '../../components/common/SectionBox';

export interface section {
  complete: boolean;
  innerText: string;
  route: string;
}

const appSections: section[] = [
  {
    complete: false,
    innerText: 'Welcome',
    route: '/welcome',
  },
  {
    complete: true,
    innerText: 'Guest Minimum expectations',
    route: '/expectations',
  },
  {
    complete: false,
    innerText: 'Basic Information',
    route: '/basic',
  },
  {
    complete: false,
    innerText: 'Other Guests/Pets',
    route: '/basic',
  },
  {
    complete: false,
    innerText: 'Employment Information',
    route: '/basic',
  },
  {
    complete: false,
    innerText: 'Education',
    route: '/basic',
  },
  {
    complete: false,
    innerText: 'Language Proficiency',
    route: '/basic',
  },
  {
    complete: false,
    innerText: 'Substance Use',
    route: '/basic',
  },
  {
    complete: false,
    innerText: 'Mental Health',
    route: '/basic',
  },
  {
    complete: false,
    innerText: 'Interest in Being a Guest',
    route: '/basic',
  },
  {
    complete: false,
    innerText: 'About You',
    route: '/basic',
  },
  {
    complete: false,
    innerText: 'Review',
    route: '/basic',
  },
];

export const Sections = () => {
  return (
    <FormContainer>
      <Stack sx={{width: '100%', paddingBlock: 3}}>
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{fontSize: 20, fontWeight: 'medium', marginBottom: 1}}
          >
            Profile Sections
          </Typography>
          <Typography sx={{fontSize: 14, fontWeight: 'medium'}}>
            0 of 11
          </Typography>
        </Stack>
        <Stack sx={{display: 'flex', gap: 1}}>
          {appSections.map(({complete, innerText, route}, index) => {
            return (
              <SectionBox
                key={index}
                complete={complete}
                innerText={innerText}
                route={route}
              />
            );
          })}
        </Stack>
      </Stack>
    </FormContainer>
  );
};
