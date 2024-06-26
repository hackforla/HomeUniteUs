import {CircularProgress, Typography, Stack} from '@mui/material';
import {useState, useEffect} from 'react';

export const LoadingComponent = () => {
  const [showText, setShowText] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <Stack alignItems="center">
        <CircularProgress value={25} />
        {showText ? (
          <div style={{maxWidth: '400px', textAlign: 'center'}}>
            <Typography variant="h6" sx={{fontSize: 24, fontWeight: 'bold'}}>
              Almost There!
            </Typography>
            <Typography variant="subtitle1" sx={{fontSize: 14}}>
              Collecting key information from our database of users as quickly
              as possible. We appreciate your patience...
            </Typography>
          </div>
        ) : null}
      </Stack>
    </div>
  );
};
