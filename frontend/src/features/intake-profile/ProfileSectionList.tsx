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
import {ArrowForwardIos, CheckRounded} from '@mui/icons-material';
import {Link as RouterLink, useParams} from 'react-router-dom';
import {motion} from 'framer-motion';

import {useGetProfileQuery} from '../../services/profile';
import {Loading} from '../ui';
import {useAppSelector} from '../../redux/hooks/store';

const statusIcon = {
  complete: (
    <CheckRounded
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
  0: -240,
  1: -70,
  2: 0,
  3: -60,
  4: -180,
};

const placementLeft: {[key: number]: number} = {
  0: 220,
  1: 20,
  2: 100,
  3: 120,
  4: 230,
};

export const ProfileSectionList = () => {
  const {profileId} = useParams();
  const {completedSections} = useAppSelector(state => state.guestProfile);

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
            {leftFieldGroups.reverse().map(({id, title}, index) => {
              return (
                <SectionLink
                  key={id}
                  id={id}
                  side="left"
                  status={
                    completedSections.includes(id) ? 'complete' : 'incomplete'
                  }
                  title={title}
                  x={placementLeft[index]}
                />
              );
            })}
          </Stack>
          <Stack sx={{flex: 1, justifyContent: 'space-around'}}>
            {rightFieldGroups.map(({id, title}, index) => {
              return (
                <SectionLink
                  key={id}
                  id={id}
                  side="right"
                  status={
                    completedSections.includes(id) ? 'complete' : 'incomplete'
                  }
                  title={title}
                  x={placementRight[index]}
                />
              );
            })}
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
};

interface SectionLinkProps extends LinkProps {
  id: string;
  x: number;
  side: 'left' | 'right';
  status: 'complete' | 'partial' | 'incomplete' | 'locked';
  title: string;
}

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const SectionLink = ({
  id,
  x,
  side,
  status,
  title,
  ...props
}: SectionLinkProps) => {
  return (
    <motion.div
      key={id}
      initial={{
        opacity: 0,
        scale: 0.85,
        filter: 'blur(2px)',
        x,
      }}
      animate={{opacity: 1, scale: 1, filter: 'blur(0px)'}}
      transition={{
        duration: 1,
        delay: randomIntFromInterval(1, 3) / 10,
        type: 'spring',
        bounce: 0,
      }}
      style={{alignSelf: side === 'left' ? 'flex-start' : 'flex-end'}}
    >
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
            textDecoration: 'none',
          },
        }}
      >
        {statusIcon[status]}
        <Typography
          sx={{
            fontSize: 16,
            color: `palette.text.primary`,
          }}
        >
          {title}
        </Typography>
        <ArrowForwardIos sx={{ml: 'auto', fontSize: 'small', opacity: 0.5}} />
      </Link>
    </motion.div>
  );
};
