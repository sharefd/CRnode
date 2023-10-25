import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { ArticleFilters } from './ArticleFilters';
import { Add } from '@mui/icons-material';
import { grey } from '@mui/material/colors';

const ActionBar = ({ user, selectedPurposes, handlePurposeChange, toggleNewArticleModal }) => {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const [currentTime, setCurrentTime] = useState(formattedTime);

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
  return (
    <Box
      display='flex'
      justifyContent='space-between'
      alignItems='center'
      px={2}
      mb={4}
      sx={{ backgroundColor: '#FAF9F6' }}>
      <Box display='flex' alignItems='center'>
        <Typography variant='caption' id='current-time' sx={{ px: 2, color: grey[600] }}>
          {currentTime}
        </Typography>
        <ArticleFilters
          userId={user._id}
          selectedPurposes={selectedPurposes}
          handlePurposeChange={handlePurposeChange}
        />
      </Box>
      {user.isAdmin && (
        <Box>
          <Button
            fullWidth
            variant='contained'
            sx={{ color: '#eaeaec' }}
            startIcon={<Add />}
            onClick={toggleNewArticleModal}>
            Create Article
          </Button>
        </Box>
      )}
    </Box>
  );
};
export default ActionBar;
