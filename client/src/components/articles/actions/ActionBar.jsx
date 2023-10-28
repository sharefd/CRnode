import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { ArticleFilters } from './ArticleFilters';
import { Add } from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import { canCreate } from '../../../utils/checkPermissions';

const ActionBar = ({ user, selectedPurposes, handlePurposeChange, toggleNewArticleModal }) => {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const [currentTime, setCurrentTime] = useState(formattedTime);
  const userCanCreate = canCreate();

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
      {userCanCreate && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#1976d2', // Set the background color
            color: 'white', // Set the text color to white
            '&:hover': {
              backgroundColor: '#135fab' // Change the background color on hover
            }
          }}
          className='button-4'
          onClick={toggleNewArticleModal}>
          <Add sx={{ fontSize: '1.1rem', mr: 0.5 }} />
          Create Event
        </Box>
      )}
    </Box>
  );
};
export default ActionBar;
