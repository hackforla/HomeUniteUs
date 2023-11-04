import {Box, Button} from '@mui/material';
import {useNavigate} from 'react-router-dom';

export default function Buttons({
  step,
  setStep,
}: {
  step: number;
  setStep: (setStep: number) => void;
}) {
  const navigate = useNavigate();

  function saveData() {
    //add logic to save current data
    console.log('data saving features not implemented');
  }
  function nextStep() {
    setStep(step + 1);
    //requires logic to stop user from continuing until data is valid
  }
  function prevStep() {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/guest');
    }
  }
  function saveAndExit() {
    saveData();
    navigate('/guest');
  }
  function nextStepAndSave() {
    saveData();
    nextStep();
    //requires logic to save the current data inputed, use reusable function
    console.log('saved and going next step feature not made yet');
  }

  return (
    <Box>
      {step == 1 && (
        <Box>
          <Button
            fullWidth
            size="medium"
            variant="contained"
            onClick={nextStep}
          >
            Next
          </Button>
          <Button
            fullWidth
            size="medium"
            variant="contained"
            onClick={prevStep}
          >
            Back
          </Button>
        </Box>
      )}
      {step == 2 && (
        <Box>
          <Button
            fullWidth
            size="medium"
            variant="contained"
            onClick={nextStep}
          >
            Start Application
          </Button>
          <Button
            fullWidth
            size="medium"
            variant="contained"
            onClick={prevStep}
          >
            Back
          </Button>
        </Box>
      )}
      {step > 2 && step <= 10 && (
        <Box>
          <Button
            fullWidth
            size="medium"
            variant="contained"
            onClick={nextStepAndSave}
          >
            Continue
          </Button>
          <Button
            fullWidth
            size="medium"
            variant="contained"
            onClick={prevStep}
          >
            Back
          </Button>
          <Button
            fullWidth
            size="medium"
            variant="contained"
            onClick={saveAndExit}
          >
            Save and Exit Application
          </Button>
        </Box>
      )}
      {step > 10 && (
        <Box>
          <Button
            fullWidth
            size="medium"
            variant="contained"
            onClick={nextStepAndSave}
          >
            Continue
          </Button>
          <Button
            fullWidth
            size="medium"
            variant="contained"
            onClick={prevStep}
          >
            Back
          </Button>
        </Box>
      )}
      {step == 12 && (
        <Box>
          <Button fullWidth size="medium" variant="contained" type="submit">
            Submit
          </Button>
          <Button
            fullWidth
            size="medium"
            variant="contained"
            onClick={prevStep}
          >
            Back
          </Button>
        </Box>
      )}
    </Box>
  );
}
