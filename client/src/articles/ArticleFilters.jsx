import { useEffect, useState } from 'react';
import { Box, Typography, ToggleButton, ToggleButtonGroup, Grid } from '@mui/material';

export const ArticleFilters = ({ selectedPurposes, handlePurposeChange }) => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
      setCurrentTime(formattedTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleToggle = (event, newPurposes) => {
    if (newPurposes.length === 0) {
      handlePurposeChange([]);
    } else if (newPurposes[0] === 'Show All' && newPurposes.length > 1) {
      const filteredPurposes = newPurposes.filter(purpose => purpose !== 'Show All');
      handlePurposeChange(filteredPurposes);
    } else {
      handlePurposeChange(newPurposes);
    }
  };

  return (
    <Box display='flex' alignItems='center' sx={{ my: 2, ml: 8 }}>
      <Grid item xs={12} md={12}>
        <Typography variant='caption' id='current-time' sx={{ px: 2, color: 'gray' }}>
          {currentTime}
        </Typography>
        <ToggleButtonGroup
            color="primary"

          value={selectedPurposes}
          onChange={handleToggle}
          aria-label='purpose'
          size='small'
          sx={{ ml: 4 }}>
          <ToggleButton value='Show All' aria-label='Show All' sx={{ textTransform: 'none', fontFamily: 'Inter' }}>
            Show All
          </ToggleButton>
          <ToggleButton
            value='Uoft OM Half-day'
            aria-label='Uoft OM Half-day'
            sx={{ textTransform: 'none', fontFamily: 'Inter' }}>
            Uoft OM Half-day
          </ToggleButton>
          <ToggleButton
            value='UofT Aerospace'
            aria-label='UofT Aerospace'
            sx={{ textTransform: 'none', fontFamily: 'Inter' }}>
            UofT Aerospace
          </ToggleButton>
          <ToggleButton value='McM Im AHD' aria-label='UofT Im AHD' sx={{ textTransform: 'none', fontFamily: 'Inter' }}>
            McM Im AHD
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
    </Box>
  );
};
