import {Button} from '@mui/material';
import {useNavigate} from 'react-router-dom';

function saveData() {
  //add logic to save current data
  console.log('data saving features not implemented');
}

export const NextStepButton = ({
  step,
  setStep,
}: {
  step: number;
  setStep: (setStep: number) => void;
}) => {
  function nextStepAndSave() {
    setStep(step + 1);
    console.log('saved and going next step feature not made yet');
    console.log(step);
  }

  return (
    <Button size="medium" variant="contained" onClick={nextStepAndSave}>
      Continue
    </Button>
  );
};

export const PrevStepButton = ({
  step,
  setStep,
}: {
  step: number;
  setStep: (setStep: number) => void;
}) => {
  const navigate = useNavigate();
  function prevStep() {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/guest');
    }
    console.log(step);
  }
  return (
    <Button
      size="medium"
      variant="outlined"
      onClick={prevStep}
      sx={{color: 'black'}}
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
    console.log('save and exit feature button');
  }
  return (
    <Button
      size="medium"
      onClick={saveAndExit}
      variant="text"
      sx={{color: 'black'}}
    >
      Save and Exit
    </Button>
  );
};
