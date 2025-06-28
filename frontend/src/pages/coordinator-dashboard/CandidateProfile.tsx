import React from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {Box, Typography, Stack, Button} from '@mui/material';
import {styled} from '@mui/system';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import {SvgIconComponent} from '@material-ui/icons';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import NoteOutlinedIcon from '@mui/icons-material/NoteOutlined';

import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import {IntakeProfileSectionsAccordion} from '../../features/coordinator-dashboard';
import {
  DashboardDataItem,
  fakeCandidates,
  IntakeProfileSection,
} from '../../services/coordinator';

const StyledButton = styled(Button)(() => ({
  // padding: `${theme.spacing(6)} ${theme.spacing(2)}`,
  fontSize: '18px',
  height: 'min(100%, fit-content)',
  width: 'fit-content',
  margin: '0 .25rem',
}));

interface CandidateDetailsProps {
  detail: string;
  display: string;
}

const CandidateDetailsComponent: React.FC<CandidateDetailsProps> = ({
  detail,
  display,
}) => {
  return (
    <Stack direction={'column'}>
      <Typography sx={{color: 'gray'}}>{display}</Typography>
      <Typography>{detail}</Typography>
    </Stack>
  );
};

interface CandidateReviewStep {
  stepName: string;
  StepIcon: SvgIconComponent;
}

const CandidateReviewStep: React.FC<CandidateReviewStep> = ({
  stepName,
  StepIcon,
}) => {
  return (
    <>
      <ListItemIcon>
        <StepIcon />
      </ListItemIcon>
      <ListItemText primary={stepName} />
      <ChevronRightIcon />
    </>
  );
};

interface CandidateReviewStepsDatum {
  stepName: string;
  StepIcon: SvgIconComponent;
}

const CandidateReviewStepsData: CandidateReviewStepsDatum[] = [
  {
    stepName: 'Intake Profile',
    StepIcon: AccountBoxIcon,
  },
  {
    stepName: 'Onboarding Events',
    StepIcon: CalendarMonthIcon,
  },
  {
    stepName: 'Matchmaking',
    StepIcon: HowToRegIcon,
  },
  {
    stepName: 'Relationship Management',
    StepIcon: HandshakeIcon,
  },
];

const CandidateReviewSteps = CandidateReviewStepsData.map((item, index) => (
  <CandidateReviewStep
    key={index}
    stepName={item.stepName}
    StepIcon={item.StepIcon}
  />
));

const IntakeProfileSectionsList: IntakeProfileSection[] = [
  {
    sectionName: 'Employement Information',
    queries: [
      {
        question: 'What is your favorite color?',
        answer: "I don't know, red?",
      },
    ],
  },
  {sectionName: 'Employement Information', queries: []},
  {sectionName: 'Language Proficiency', queries: []},
  {
    sectionName: 'Substance Abuse',
    queries: [
      {
        question: 'Do you smoke cigarettes?',
        answer: 'Yes',
      },
      {
        question: 'Do you drink alcohol?',
        answer: 'Yes',
      },
      {
        question: 'Do you use any other substances?',
        answer: 'No',
      },
    ],
  },
  {sectionName: 'Education', queries: []},
  {sectionName: 'Background', queries: []},
  {sectionName: 'Interest as Guest', queries: []},
];

export const CandidateProfile = () => {
  let {profileId} = useParams();
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleListItemClick = (
    event: React.MouseEvent<Element, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
  };

  if (profileId === undefined) {
    profileId = '1';
  }

  const thisCandidate: DashboardDataItem = fakeCandidates.filter(
    candi => candi['id'] === parseInt(profileId),
  )[0];

  const candidateDetails: {details: string; display: string}[] = [
    {details: thisCandidate['userType'], display: 'Type'},
    {details: thisCandidate['caseStatus'], display: 'Stage'},
    {
      details: thisCandidate['coordinatorName'],
      display: 'Coordinator Name',
    },
    {
      details: new Date(thisCandidate['lastUpdated'])
        .toLocaleDateString('en-US')
        .toString(),
      display: 'Date Updated',
    },
  ];

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: 'space-between',
          padding: '15px',
          borderBottom: '1px solid gray',
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
      <Stack
        direction={'column'}
        spacing={2}
        sx={{
          padding: '1rem',
          borderBottom: '1px solid gray',
        }}
      >
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Stack direction={'row'} spacing={1}>
            <img
              src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.publicdomainpictures.net%2Fpictures%2F130000%2Fvelka%2Fgray-box-background.jpg&f=1&nofb=1&ipt=861ee29a7bd3c2431072fa18438ab2e2bcba1caf506893af296f8120f385de9b"
              height={'50px'}
              width={'50px'}
            />
            <h2>{thisCandidate['userName']}</h2>
            <em>{thisCandidate['caseStatus']}</em>
          </Stack>
          <Stack>
            <Button variant="outlined">
              <NoteOutlinedIcon sx={{margin: '0px 8px 0 -8px'}} />
              Notes
            </Button>
          </Stack>
        </Stack>
        <Stack direction={'row'} spacing={4}>
          {candidateDetails.map(detail => (
            <Box key={detail.details}>
              <CandidateDetailsComponent
                detail={detail.details}
                display={detail.display}
              />
            </Box>
          ))}
        </Stack>
      </Stack>
      <Stack direction={{xs: 'column', md: 'row'}} spacing={2} margin={'1rem'}>
        <Box
          sx={{
            borderRadius: '10px',
            bgcolor: '#F0F0F0',
          }}
        >
          <List
            component="nav"
            aria-label="secondary mailbox folder"
            // https://stackoverflow.com/questions/61486061/how-to-set-selected-and-hover-color-of-listitem-in-material-ui
            sx={{
              margin: '0.2rem',
              padding: '0.2rem',
              display: 'flex',
              flexDirection: {xs: 'row', md: 'column'},
              // selected and (selected + hover) states
              '&& .Mui-selected, && .Mui-selected:hover': {
                bgcolor: 'white',
              },
              // hover states
              '& .MuiListItemButton-root:hover': {
                bgcolor: 'lightBlue',
              },
            }}
          >
            {CandidateReviewSteps.map((item, index) => (
              <Box
                key={index}
                sx={{
                  width: '15rem',
                }}
              >
                <ListItemButton
                  sx={{
                    borderRadius: '10px',
                    height: '100%',
                  }}
                  selected={selectedIndex === index}
                  onClick={event => handleListItemClick(event, index)}
                >
                  {item}
                </ListItemButton>
              </Box>
            ))}
          </List>
        </Box>
        <Stack
          direction={'column'}
          sx={{
            width: '100%',
            border: '3px solid #eceff1',
            borderRadius: '10px',
            margin: '1rem',
            // padding: '1rem',
          }}
        >
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            sx={{padding: '1rem'}}
          >
            <Stack
              direction={'column'}
              justifyContent={'space-between'}
              sx={{
                height: '3rem',
              }}
            >
              <Stack
                direction={'row'}
                height={'1rem'}
                alignItems={'center'}
                spacing={2}
              >
                <AccountBoxIcon />
                <h2>Intake Profile</h2>
              </Stack>
              <p>Submitted on Blah Blah date</p>
            </Stack>
            <Stack direction={'row'}>
              <StyledButton variant="contained">Approve Guest</StyledButton>
              {[/*'Approve Guest',*/ 'Request More Info', 'Deny'].map(
                (item, index) => (
                  <StyledButton variant="outlined" key={index}>
                    {item}
                  </StyledButton>
                ),
              )}
            </Stack>
          </Stack>
          <Box
            sx={{
              borderTop: '1px solid #eceff1',
              padding: '1rem',
              height: '100%',
            }}
          >
            <Stack direction={'column'}>
              <IntakeProfileSectionsAccordion
                IntakeProfileSectionsList={IntakeProfileSectionsList}
              />
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </>
  );
};
