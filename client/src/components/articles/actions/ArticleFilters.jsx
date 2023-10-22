import { useEffect, useState } from 'react';
import { Typography, ToggleButton, ToggleButtonGroup, Grid } from '@mui/material';
import { PURPOSE_CHOICES } from '@/utils/constants';

export const ArticleFilters = ({ allowedPurposes, selectedPurposes, handlePurposeChange }) => {
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
    <Grid item xs={4} md={4} sx={{ pt: 2, pb: 2 }}>
      <Typography variant='caption' id='current-time' sx={{ px: 2, color: 'gray' }}>
        {currentTime}
      </Typography>
      <ToggleButtonGroup
        color='primary'
        value={selectedPurposes}
        onChange={handleToggle}
        aria-label='purpose'
        size='small'
        sx={{ ml: 4 }}>
        <ToggleButton value='Show All' aria-label='Show All' sx={{ textTransform: 'none', fontFamily: 'Inter' }}>
          Show All
        </ToggleButton>
        {allowedPurposes.map(purpose => (
          <ToggleButton
            key={purpose}
            value={PURPOSE_CHOICES[purpose]}
            aria-label={purpose}
            sx={{ textTransform: 'none', fontFamily: 'Inter' }}>
            {purpose}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Grid>
  );
};
