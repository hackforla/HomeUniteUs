import React from 'react';
import {
  Stack,
  Typography,
  Container,
  Box,
  Link,
  LinkProps,
} from '@mui/material';
import {InProgressIcon} from '../ui/icons/InProgressIcon';
import LockIcon from '@mui/icons-material/Lock';
import {ArrowForwardIos, CheckCircleOutlined} from '@mui/icons-material';
import {Link as RouterLink, useParams} from 'react-router-dom';
import {motion} from 'framer-motion';

import {useGetProfileQuery} from '../../services/profile';
import {Loading} from '../ui';

const statusIcon = {
  complete: (
    <CheckCircleOutlined
      color="success"
      sx={{backgroundColor: 'white', borderRadius: '50%'}}
    />
  ),
  incomplete: (
    <Box
      sx={{
        width: 24,
        height: 24,
        border: `2px solid white`,
        borderRadius: `100%`,
        opacity: 0.5,
      }}
    />
  ),
  locked: (
    <LockIcon
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.38)',
        borderRadius: '50%',
        padding: '5px',
        color: 'rgba(0, 0, 0, 0.54)',
      }}
    />
  ),
  partial: <InProgressIcon />,
};

const placementRight: {[key: number]: number} = {
  0: 240,
  1: 80,
  2: 0,
  3: 60,
  4: 180,
};

const placementLeft: {[key: number]: number} = {
  0: 130,
  1: 20,
  2: 100,
  3: 60,
  4: 240,
};

export const ProfileSectionList = () => {
  const {profileId} = useParams();

  const {data: profileData, isLoading} = useGetProfileQuery(
    {profileId: profileId},
    {skip: !profileId},
  );

  if (isLoading || profileData === undefined) return <Loading />;

  const {fieldGroups} = profileData;
  const rightFieldGroups = fieldGroups.slice(0, fieldGroups.length / 2);
  const leftFieldGroups = fieldGroups.slice(fieldGroups.length / 2);

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        py: 4,
        gap: 6,
      }}
    >
      <Typography variant="h4" sx={{textAlign: 'center'}}>
        We want to get to know you better
      </Typography>

      <Stack
        sx={{
          position: 'relative',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img src="/images/guest-welcome.svg" style={{width: '50%'}} />
        <Stack
          sx={{
            position: 'absolute',
            inset: 0,
            flexDirection: 'row',
          }}
        >
          <Stack sx={{flex: 1, justifyContent: 'space-around'}}>
            {leftFieldGroups.map(({id, title}, index) => {
              // Change status here to see different styles
              // complete | partial | incomplete | locked
              const status = 'incomplete';
              return (
                <motion.div
                  key={id}
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                    filter: 'blur(2px)',
                    x: placementLeft[index],
                  }}
                  animate={{opacity: 1, scale: 1, filter: 'blur(0px)'}}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                    type: 'spring',
                    bounce: 0,
                  }}
                  style={{alignSelf: 'flex-start'}}
                >
                  <SectionLink id={id}>
                    {statusIcon[status]}
                    <Typography
                      sx={{
                        fontSize: 16,
                        color: `palette.text.primary`,
                      }}
                    >
                      {title}
                    </Typography>
                    <ArrowForwardIos sx={{ml: 'auto', fontSize: 'medium'}} />
                  </SectionLink>
                </motion.div>
              );
            })}
          </Stack>
          <Stack sx={{flex: 1, justifyContent: 'space-around'}}>
            {rightFieldGroups.map(({id, title}, index) => {
              // Change status here to see different styles
              // complete | partial | incomplete | locked
              const status = 'incomplete';
              return (
                <motion.div
                  key={id}
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                    filter: 'blur(4px)',
                    x: placementRight[index] * -1,
                  }}
                  animate={{opacity: 1, scale: 1, filter: 'blur(0px)'}}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                    type: 'spring',
                    bounce: 0,
                  }}
                  style={{alignSelf: 'flex-end'}}
                >
                  <SectionLink key={id} id={id}>
                    {statusIcon[status]}
                    <Typography
                      sx={{
                        fontSize: 16,
                        color: `palette.text.primary`,
                      }}
                    >
                      {title}
                    </Typography>
                    <ArrowForwardIos sx={{ml: 'auto', fontSize: 'medium'}} />
                  </SectionLink>
                </motion.div>
              );
            })}
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
};

interface SectionLinkProps extends LinkProps {
  children: React.ReactNode;
  id: string;
}

const SectionLink = ({children, id, ...props}: SectionLinkProps) => {
  return (
    <Link
      to={`${id}`}
      component={RouterLink}
      sx={{
        ...props.sx,
        display: 'flex',
        borderRadius: '99999px',
        backgroundColor: 'primary.main',
        color: 'white',
        alignItems: 'center',
        padding: 2,
        gap: 2,
        '&:hover': {
          backgroundColor: 'primary.dark',
        },
      }}
    >
      {children}
    </Link>
  );
};
