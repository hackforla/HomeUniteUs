import {Button, Stack} from '@mui/material';
import {useNavigate} from 'react-router-dom';

function saveData() {
  //add logic to save current data
  console.log('data saving features not implemented');
}

export const NextStepButton = ({
  step,
  setStep,
  TOTALPAGES,
  nextPage,
}: {
  step: number;
  setStep: (setStep: number) => void;
  TOTALPAGES: number;
  nextPage: string;
}) => {
  const navigate = useNavigate();
  const lastPage = TOTALPAGES - 1;
  function nextStepAndSave() {
    saveData();
    if (step < lastPage) {
      navigate(nextPage);
      setStep(step + 1);
    } else if (step === lastPage) {
      navigate('/guest'); //change to review file
    }
  }

  return (
    <Button
      fullWidth
      size="medium"
      variant="contained"
      onClick={nextStepAndSave}
    >
      Continue
    </Button>
  );
};

export const PrevStepButton = ({
  step,
  setStep,
  prevPage,
}: {
  step: number;
  setStep: (setStep: number) => void;
  prevPage: string;
}) => {
  const navigate = useNavigate();
  function prevStep() {
    if (step > 1) {
      setStep(step - 1);
      navigate(prevPage);
    } else {
      navigate('/guest');
    }
  }
  return (
    <Button
      fullWidth
      size="medium"
      variant="outlined"
      onClick={prevStep}
      sx={{color: 'black', border: 2, borderColor: 'primary.main'}}
    >
      Back
    </Button>
  );
};

export const SaveAndExitButton = () => {
  const navigate = useNavigate();
  function saveAndExit() {
    saveData();
    navigate('/guest');
  }
  return (
    <Button
      fullWidth
      size="medium"
      onClick={saveAndExit}
      variant="text"
      sx={{color: 'black'}}
    >
      Save and Exit
    </Button>
  );
};

export const navButtons = () => {
  return (
    <Stack>
      <Button
        fullWidth
        size="medium"
        variant="contained"
        /* onClick={nextStep} */
      >
        Continue
      </Button>
      <Button
        fullWidth
        size="medium"
        variant="outlined"
        /* onClick={prevStep} */
        sx={{color: 'black', border: 2, borderColor: 'primary.main'}}
      >
        Back
      </Button>
      <Button
        fullWidth
        size="medium"
        /* onClick={saveAndExit} */
        variant="text"
        sx={{color: 'black'}}
      >
        Save and Exit
      </Button>
    </Stack>
  );
};
