import {Box, Stack, Typography} from '@mui/material';
import {FormContainer} from '../../components/authentication/FormContainer';
import {CheckCircleOutlined, CircleOutlined} from '@mui/icons-material';

export const Sections = ({
  setStep,
  contentPerSection,
  setShowSections,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  contentPerSection: {
    [key: number]: {complete: boolean; innerText: string; route: string};
  };
  setShowSections: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleClick = (index: number) => {
    setStep(index);
    setShowSections(false);
  };
  return (
    <FormContainer>
      <Stack sx={{width: '100%', paddingBlock: 3}}>
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{fontSize: 20, fontWeight: 'medium', marginBottom: 1}}
          >
            Profile Sections
          </Typography>
          <Typography sx={{fontSize: 14, fontWeight: 'medium'}}>
            0 of 11
          </Typography>
        </Stack>
        <Stack sx={{display: 'flex', gap: 1}}>
          {Object.values(contentPerSection).map(
            ({complete, innerText}, index) => (
              <Box
                key={index}
                onClick={() => handleClick(index)}
                sx={{
                  borderRadius: 2,
                  backgroundColor: complete ? '#EAF2EA' : '#ffffff',
                  height: 56,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingInline: 3,
                }}
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
            ),
          )}
        </Stack>
      </Stack>
    </FormContainer>
  );
};
