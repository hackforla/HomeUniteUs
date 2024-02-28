import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress';

const BorderLinearProgress = styled(LinearProgress)(({theme}) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[300],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.primary,
  },
}));

export default function ProgressBar({
  progressBarValue,
}: {
  progressBarValue: number;
}) {
  return (
    <Box sx={{flexGrow: 1}}>
      <BorderLinearProgress variant="determinate" value={progressBarValue} />
    </Box>
  );
}
