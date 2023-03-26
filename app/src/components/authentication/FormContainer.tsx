import {Box} from '@mui/material';

interface FormContainerProps {
  children: React.ReactNode;
}

export function FormContainer({children}: FormContainerProps) {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(4, 1fr)',
        sm: 'repeat(8, 1fr)',
        md: 'repeat(12, 1fr)',
      }}
      justifyContent="center"
      alignItems="center"
      gap={1}
      sx={{height: '100%', mx: {xs: 2, sm: 3}}}
    >
      <Box
        gridColumn={{
          xs: 'span 4',
          sm: '3 / 7',
          md: '5 / 9',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
