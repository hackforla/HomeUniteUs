import {Button} from '@mui/material';
import {useNavigate} from 'react-router-dom';

const navigate = useNavigate();

function saveData() {
  //add logic to save current data
  console.log('data saving features not implemented');
}

export const nextStepButton = ({
  step,
  setStep,
}: {
  step: number;
  setStep: (setStep: number) => void;
}) => {
  function nextStepAndSave() {
    saveData();
    setStep(step + 1);
    //requires logic to save the current data inputed, use reusable function
    console.log('saved and going next step feature not made yet');
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

export const prevStepButton = ({
  step,
  setStep,
}: {
  step: number;
  setStep: (setStep: number) => void;
}) => {
  function prevStep() {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/guest');
    }
  }
  return (
    <Button fullWidth size="medium" variant="contained" onClick={prevStep}>
      Back
    </Button>
  );
};

export const saveAndExitButton = () => {
  function saveAndExit() {
    saveData();
    navigate('/guest');
  }
  return (
    <Button fullWidth size="medium" variant="contained" onClick={saveAndExit}>
      Save and Exit
    </Button>
  );
};
