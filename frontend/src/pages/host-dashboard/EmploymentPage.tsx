/* eslint-disable */
import {
  Box,
  Typography,
  Divider,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Checkbox,
} from '@mui/material';
import {styled} from '@mui/system';
import {useNavigate} from 'react-router-dom';
import {useState} from 'react';
import CloseIcon from '@mui/icons-material/Close';

export function EmploymentPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [employmentStatus, setEmploymentStatus] = useState('');

  const [jobs, setJobs] = useState([
    {
      position: '',
      startDate: '',
      place: '',
      endDate: '',
      currentlyWorking: false,
    },
  ]);
  const [confirmRemoveIndex, setConfirmRemoveIndex] = useState<number | null>(
    null,
  );

  const [error, setError] = useState('');

  const validateStep1 = () => {
    if (!employmentStatus) {
      setError('Please select your employment status.');
      return false;
    }
    setError('');
    return true;
  };

  const validateStep2 = () => {
    const dateRegex = /^(0[1-9]|1[0-2])\/\d{4}$/;

    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      const jobNum = i + 1;

      if (!job.position.trim()) {
        setError(`Employment ${jobNum}: Position is required.`);
        return false;
      }

      if (!job.place.trim()) {
        setError(`Employment ${jobNum}: Place of Employment is required.`);
        return false;
      }

      if (!job.startDate.trim()) {
        setError(`Employment ${jobNum}: Start Date is required.`);
        return false;
      }

      if (!dateRegex.test(job.startDate)) {
        setError(`Employment ${jobNum}: Start Date must be in mm/yyyy format.`);
        return false;
      }

      if (!job.currentlyWorking) {
        if (!job.endDate.trim()) {
          setError(
            `Employment ${jobNum}: End Date is required unless currently working.`,
          );
          return false;
        }

        if (!dateRegex.test(job.endDate)) {
          setError(`Employment ${jobNum}: End Date must be in mm/yyyy format.`);
          return false;
        }
      }
    }

    setError('');
    return true;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!validateStep1()) return;
      setStep(2);
    } else if (step === 2) {
      if (!validateStep2()) return;
      navigate('/host/overview');
    }
  };

  const handlePrevious = () => {
    if (step === 2) setStep(1);
    else navigate('/host/housing');
  };

  const handleJobChange = (
    index: number,
    field: keyof (typeof jobs)[0],
    value: string | boolean,
  ) => {
    const updatedJobs = [...jobs];
    updatedJobs[index] = {...updatedJobs[index], [field]: value};

    // Clear endDate if currentlyWorking is true
    if (field === 'currentlyWorking' && value === true) {
      updatedJobs[index].endDate = '';
    }

    setJobs(updatedJobs);
  };

  const addJob = () => {
    if (jobs.length < 5) {
      setJobs([
        ...jobs,
        {
          position: '',
          startDate: '',
          place: '',
          endDate: '',
          currentlyWorking: false,
        },
      ]);
    }
  };

  const confirmRemoveJob = () => {
    if (confirmRemoveIndex !== null) {
      const updatedJobs = jobs.filter((_, i) => i !== confirmRemoveIndex);
      setJobs(updatedJobs);
      setConfirmRemoveIndex(null);
    }
  };

  return (
    <PageContainer>
      <Header>
        <Typography
          variant="body2"
          sx={{cursor: 'pointer'}}
          onClick={() => navigate('/host/')}
        >
          &lt; Back to Dashboard
        </Typography>
      </Header>

      <ContentContainer>
        <Typography
          variant="body2"
          sx={{
            cursor: 'pointer',
            color: 'primary.main',
            mb: 2,
            fontWeight: 500,
          }}
          onClick={() => navigate('/host/overview')}
        >
          &lt; My Profile Overview
        </Typography>

        <Typography variant="h4" gutterBottom sx={{fontWeight: 'bold'}}>
          Employment
        </Typography>

        <Typography variant="body2" sx={{mb: 3}}>
          {step === 1
            ? 'Tell us about your employment for the past 5 years, starting with your current occupation.'
            : step === 2
              ? 'Tell us about your employment for the past 5 years, including up to 5 entries.'
              : ''}
        </Typography>

        <Divider sx={{my: 3}} />

        {step === 1 && (
          <>
            <FormControl fullWidth sx={{mb: 3}}>
              <FormLabel sx={{fontWeight: 'bold', color: 'black', mb: 1}}>
                Are you currently working?
              </FormLabel>
              <RadioGroup
                value={employmentStatus}
                onChange={e => setEmploymentStatus(e.target.value)}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </>
        )}

        {step === 2 && (
          <>
            {jobs.map((job, idx) => (
              <Box
                key={idx}
                sx={{
                  mb: 3,
                  p: 2,
                  border: '1px solid #ccc',
                  borderRadius: 2,
                  backgroundColor: '#f9f9f9',
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{mb: 2, fontWeight: 'bold'}}
                >
                  Employment {idx + 1}
                </Typography>

                <FormControl fullWidth sx={{mb: 2}}>
                  <FormLabel sx={{fontWeight: 'bold', mb: 1}}>
                    Position
                  </FormLabel>
                  <TextField
                    value={job.position}
                    onChange={e =>
                      handleJobChange(idx, 'position', e.target.value)
                    }
                    fullWidth
                  />
                </FormControl>

                <FormControl fullWidth sx={{mb: 2}}>
                  <FormLabel sx={{fontWeight: 'bold', mb: 1}}>
                    Place of Employment
                  </FormLabel>
                  <TextField
                    value={job.place}
                    onChange={e =>
                      handleJobChange(idx, 'place', e.target.value)
                    }
                    fullWidth
                  />
                </FormControl>

                <FormControl fullWidth sx={{mb: 2}}>
                  <FormLabel sx={{fontWeight: 'bold', mb: 1}}>
                    Start Date
                  </FormLabel>
                  <TextField
                    value={job.startDate}
                    onChange={e =>
                      handleJobChange(idx, 'startDate', e.target.value)
                    }
                    placeholder="mm/yyyy"
                    fullWidth
                  />
                </FormControl>

                <FormControl fullWidth sx={{mb: 2}}>
                  <FormLabel sx={{fontWeight: 'bold', mb: 1}}>
                    End Date
                  </FormLabel>
                  <TextField
                    value={job.endDate}
                    onChange={e =>
                      handleJobChange(idx, 'endDate', e.target.value)
                    }
                    placeholder="mm/yyyy"
                    fullWidth
                    disabled={job.currentlyWorking}
                  />
                </FormControl>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={job.currentlyWorking}
                      onChange={e =>
                        handleJobChange(
                          idx,
                          'currentlyWorking',
                          e.target.checked,
                        )
                      }
                    />
                  }
                  label="Currently working in this position"
                  sx={{mb: 2}}
                />

                <Button
                  variant="text"
                  color="error"
                  onClick={() => setConfirmRemoveIndex(idx)}
                  disabled={jobs.length === 1}
                >
                  X Remove This Position
                </Button>
              </Box>
            ))}

            <Button
              variant="text"
              onClick={addJob}
              sx={{color: 'primary.main', mb: 2}}
              disabled={jobs.length >= 5}
            >
              + Add Another Position
            </Button>
          </>
        )}

        <Divider sx={{my: 3}} />

        {error && (
          <Typography variant="body2" color="error" sx={{mb: 2}}>
            {error}
          </Typography>
        )}

        <ButtonRow>
          <Button
            variant="outlined"
            onClick={handlePrevious}
            sx={{color: 'black', borderColor: 'black'}}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{
              backgroundColor: 'black',
              color: 'white',
              '&:hover': {backgroundColor: '#333'},
            }}
          >
            Next
          </Button>
        </ButtonRow>

        <Dialog
          open={confirmRemoveIndex !== null}
          onClose={() => setConfirmRemoveIndex(null)}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              pt: 3,
              pb: 1,
              px: 3,
            }}
          >
            <Typography variant="h6" sx={{fontWeight: 'bold'}}>
              Are you sure you want to remove this position?
            </Typography>
            <IconButton
              onClick={() => setConfirmRemoveIndex(null)}
              size="small"
              sx={{mt: '-8px'}}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Divider sx={{my: 1}} />
          </DialogContent>
          <DialogActions sx={{justifyContent: 'space-between', px: 3, pb: 2}}>
            <Button
              onClick={() => setConfirmRemoveIndex(null)}
              variant="outlined"
              sx={{
                color: 'black',
                borderColor: 'black',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                  borderColor: '#333',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmRemoveJob}
              variant="contained"
              sx={{
                backgroundColor: 'black',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#333',
                },
              }}
            >
              I'm Sure
            </Button>
          </DialogActions>
        </Dialog>
      </ContentContainer>
    </PageContainer>
  );
}

// Styled Components
const PageContainer = styled(Box)({
  backgroundColor: '#fafafa',
  minHeight: '100vh',
});

const Header = styled(Box)(({theme}) => ({
  padding: theme.spacing(2, 4),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const ContentContainer = styled(Box)(({theme}) => ({
  maxWidth: '50%',
  margin: '80px auto 0 auto',
  padding: theme.spacing(4),
  backgroundColor: '#fff',
  borderRadius: theme.spacing(2),
  textAlign: 'left',
}));

const ButtonRow = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
});
