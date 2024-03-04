import {Stack, Typography} from '@mui/material';
import {FormContainer} from '../../components/authentication/FormContainer';
import {SectionBox} from '../../components/common/SectionBox';

export const Sections = ({
  setStep,
  stepToRouteMapping,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  stepToRouteMapping: {
    [key: number]: {complete: boolean; innerText: string; route: string};
  };
}) => {
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
          {Object.values(stepToRouteMapping).map(
            ({complete, innerText}, index) => (
              <SectionBox
                key={index}
                complete={complete}
                innerText={innerText}
                setStep={setStep}
                routeStep={index}
              />
            ),
          )}
        </Stack>
      </Stack>
    </FormContainer>
  );
};
