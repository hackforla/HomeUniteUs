import {CheckCircleOutlined, CircleOutlined} from '@mui/icons-material';
import {Box, Typography} from '@mui/material';

export const SectionBox = ({
  complete,
  innerText,
  routeStep,
  setStep,
  setShowSections,
}: {
  complete: boolean;
  innerText: string;
  routeStep: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setShowSections: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleClick = () => {
    setStep(routeStep);
    setShowSections(false);
  };
  return (
    <Box
      sx={{
        borderRadius: 2,
        backgroundColor: complete ? '#EAF2EA' : 'white',
        height: 56,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingInline: 3,
      }}
      onClick={handleClick}
    >
      <Typography sx={{fontSize: 16, fontWeight: 'medium'}}>
        {innerText}
      </Typography>
      {complete ? (
        <CheckCircleOutlined color="success" />
      ) : (
        <CircleOutlined color="action" />
      )}
    </Box>
  );
};
