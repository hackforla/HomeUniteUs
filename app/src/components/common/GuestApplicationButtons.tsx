import {Button, Stack} from '@mui/material';
import {useNavigate} from 'react-router-dom';

export const NavButtons = ({
  step,
  setStep,
  TOTALPAGES,
}: {
  step: number;
  setStep: (setStep: number) => void;
  TOTALPAGES: number;
}) => {
  const stepToRouteMapping: any = {
    1: '',
    2: 'tester2',
  };
  const navigate = useNavigate();
  const lastPage = TOTALPAGES - 1;

  function saveData() {
    //add logic to save current data
    console.log('data saving features not implemented');
  }

  function nextStep() {
    saveData();
    const newStep = step + 1;
    if (newStep < lastPage) {
      setStep(newStep);
      navigate(stepToRouteMapping[newStep]);
    } else if (newStep === lastPage) {
      navigate('/guest'); // change to review file
    }
  }
  function prevStep() {
    const newStep = step - 1;
    if (step > 1) {
      setStep(newStep);
      navigate(stepToRouteMapping[newStep]);
    } else {
      navigate('/guest');
    }
  }
  function saveAndExit() {
    saveData();
    navigate('/guest');
  }
  return (
    <Stack gap={2}>
      <Button fullWidth size="medium" variant="contained" onClick={nextStep}>
        Continue
      </Button>
      <Button
        fullWidth
        size="medium"
        variant="outlined"
        onClick={prevStep}
        sx={{color: 'black', border: 2, borderColor: 'primary.main'}}
      >
        Back
      </Button>
      <Button
        fullWidth
        size="medium"
        onClick={saveAndExit}
        variant="text"
        sx={{color: 'black'}}
      >
        Save and Exit
      </Button>
    </Stack>
  );
};
