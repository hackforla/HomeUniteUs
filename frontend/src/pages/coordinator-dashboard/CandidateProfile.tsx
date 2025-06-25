import {useParams, useNavigate} from 'react-router-dom';
import {Typography, Stack, Button} from '@mui/material';
import {styled} from '@mui/system';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const StyledButton = styled(Button)(() => ({
  // padding: `${theme.spacing(6)} ${theme.spacing(2)}`,
  width: '120px',
  fontSize: '18px',
}));

export const CandidateProfile = () => {
  let {profileId} = useParams();
  const navigate = useNavigate();

  if (profileId === undefined) {
    profileId = '1';
  }

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px',
          borderBottom: '1px solid black',
          gridColumn: {
            sm: '1 / 5',
            md: '1 / 9',
            lg: '2 / 12',
          },
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            '&:hover': {
              bgcolor: 'lightGreen',
              transition: '0.3s',
            },
          }}
        >
          <ArrowBackIcon />
          <Typography
            onClick={() => navigate('/coordinator')}
            fontSize="18px"
            fontWeight="normal"
          >
            Back to Dashboard
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <StyledButton
            variant="outlined"
            onClick={() => {
              navigate(`/coordinator/profile/${parseInt(profileId) - 1}`);
            }}
          >
            <ArrowBackIosIcon />
            Previous
          </StyledButton>
          <StyledButton
            variant="outlined"
            onClick={() => {
              navigate(`/coordinator/profile/${parseInt(profileId) + 1}`);
            }}
          >
            Next
            <ArrowForwardIosIcon sx={{marginLeft: '10px'}} />
          </StyledButton>
        </Stack>
      </Stack>
      <h1>Coordinator Profile: {profileId}</h1>;
    </>
  );
};
