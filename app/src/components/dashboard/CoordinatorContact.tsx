import {EmailOutlined, PhoneOutlined} from '@mui/icons-material';
import {Box, Stack, Typography} from '@mui/material';
import {styled} from '@mui/system';

interface CoordinatorContactProps {
  image: string;
  name: string;
  email: string;
  phone: string;
}

console.log('pass tests');

export const CoordinatorContact = ({
  image,
  name,
  email,
  phone,
}: CoordinatorContactProps) => {
  return (
    <StyledContainer direction="row">
      <StyledImageContainer>
        <img
          style={{height: '100%', width: '100%', objectFit: 'cover'}}
          src={image}
          alt="coordinator profile image"
          loading="lazy"
        />
      </StyledImageContainer>
      <Stack>
        <Typography sx={{fontSize: 20, fontWeight: 'medium'}}>
          {name}
        </Typography>
        <Typography sx={{fontSize: 14, color: 'text.secondary'}}>
          Coordinator
        </Typography>
        <Stack direction="row" sx={{alignItems: 'center', gap: 1}}>
          <EmailOutlined sx={{fontSize: 16, color: 'text.secondary'}} />
          <StyledLink rel="noopener noreferrer" href={`mailto:${email}`}>
            {email}
          </StyledLink>
        </Stack>
        <Stack direction="row" sx={{alignItems: 'center', gap: 1}}>
          <PhoneOutlined sx={{fontSize: 16, color: 'text.secondary'}} />
          <StyledLink rel="noopener noreferrer" href={`tel:${phone}`}>
            {phone}
          </StyledLink>
        </Stack>
      </Stack>
    </StyledContainer>
  );
};

const StyledContainer = styled(Stack)(({theme}) => ({
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
  borderRadius: '4px',
  gap: theme.spacing(3),
  padding: '16px',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.common.white,
}));

const StyledImageContainer = styled(Box)(({theme}) => ({
  borderRadius: '50%',
  overflow: 'hidden',
  width: theme.spacing(10.5),
  height: theme.spacing(10.5),
  justifyContent: 'center',
  alignItems: 'center',
}));

const StyledLink = styled('a')(({theme}) => ({
  fontSize: 14,
  color: theme.palette.text.secondary,
  textDecorationColor: 'inherit',
}));
