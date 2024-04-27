import {CircularProgress, Typography, Stack} from '@mui/material';
import {useState, useEffect} from 'react';

export const LoadingComponent = () => {
  const [text, showText] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      showText(true);
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
      <Stack>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <CircularProgress value={25} />
        </div>

        {text ? (
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <div style={{maxWidth: '400px', textAlign: 'center'}}>
              <Typography variant="h6" sx={{fontSize: 24, fontWeight: 'bold'}}>
                Almost There!
              </Typography>

              <Typography variant="subtitle1" sx={{fontSize: 14}}>
                Collecting key information from our database of users as quickly
                as possible. We appreciate your patience...
              </Typography>
            </div>
          </div>
        ) : null}
      </Stack>
    </div>
  );
};
