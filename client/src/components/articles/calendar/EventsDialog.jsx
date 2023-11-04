import { Typography, Box, Dialog, DialogContent, IconButton, Button } from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  ChevronLeft,
  ChevronRight,
  ContentCopy as ContentCopyIcon,
  Groups as GroupsIcon,
  Https as HttpsIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import { useState } from 'react';
import { purposeIcons } from '@/components/ui/PurposeIcons';
import { formatDate } from '@/utils/dates';

const EventsDialog = ({ open, setOpen, events = [], initialIndex, selectedArticle }) => {
  const [currentEventIndex, setCurrentEventIndex] = useState(initialIndex);
  const [currentArticle, setCurrentArticle] = useState(selectedArticle || events[0]);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyToClipboard = text => {
    navigator.clipboard.writeText(text).then(
      function () {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 600); // Reset the state after 2 seconds
        console.log('Link copied to clipboard');
      },
      function (err) {
        console.error('Failed to copy link to clipboard', err);
      }
    );
  };

  const handleNextEvent = () => {
    const newIndex = Math.min(currentEventIndex + 1, events.length - 1);
    setCurrentEventIndex(newIndex);
    setCurrentArticle(events[newIndex].resource);
  };

  const handlePrevEvent = () => {
    const newIndex = Math.max(currentEventIndex - 1, 0);
    setCurrentEventIndex(newIndex);
    setCurrentArticle(events[newIndex].resource);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentEventIndex(0);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent className='modal-title' sx={{ padding: '20px' }}>
        <Typography variant='h6' sx={{ marginBottom: '25px' }}>
          {currentArticle.title}
        </Typography>
        <Box className='modal-info' sx={{ marginBottom: '30px' }}>
          <Box className='modal-purpose'>
            <AccessTimeIcon sx={{ mr: 2 }} />
            <span className='modal-purpose-date'>{formatDate(currentArticle.date)}</span>
            <span className='modal-purpose-at'>@</span>
            <span className='modal-purpose-time'>{currentArticle.time}</span>
          </Box>

          <Box className='modal-purpose'>
            <Box className='event-purpose-badge'>
              {purposeIcons[currentArticle.purpose.name] || purposeIcons.DEFAULT}
              <span style={{ fontSize: '13px' }}>{currentArticle.purpose.name}</span>
            </Box>
            {isCopied && <div className='copied-message'>Copied</div>}
          </Box>
          <Box className='modal-purpose'>
            <LinkIcon sx={{ mr: 1 }} />
            <Button
              variant='outlined'
              size='small'
              sx={{
                textTransform: 'none',
                color: 'black',
                borderColor: 'black',
                margin: '5px',
                '&:hover': {
                  backgroundColor: '#07A24A',
                  color: 'white',
                  borderColor: 'black'
                }
              }}
              onClick={() => handleCopyToClipboard(currentArticle.event_link)}>
              <ContentCopyIcon sx={{ mr: 1 }} /> Copy Link
            </Button>
            <Button
              variant='outlined'
              onClick={() => window.open(currentArticle.event_link, '_blank')}
              size='small'
              sx={{
                textTransform: 'none',
                color: 'black',
                borderColor: 'black',
                margin: '5px',
                '&:hover': { backgroundColor: '#1976d2', color: 'white', borderColor: 'black' }
              }}>
              <GroupsIcon sx={{ mr: 1 }} /> Join Meeting
            </Button>
          </Box>
          <Box className='modal-purpose' style={{ marginBottom: 0 }}>
            <HttpsIcon sx={{ mr: 1 }} />
            <span>Meeting ID: {currentArticle.meeting_id || 'None'}</span>
            <span className='modal-purpose-at'>|</span>
            <span>Passcode: {currentArticle.passcode || 'None'}</span>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton onClick={handlePrevEvent} disabled={currentEventIndex === 0}>
            <ChevronLeft />
          </IconButton>
          <IconButton onClick={handleNextEvent} disabled={currentEventIndex === events.length - 1}>
            {events.length > 1 && (
              <Typography sx={{ fontSize: '14px', fontWeight: '900', color: 'black' }}>
                {`${currentEventIndex + 1}/${events.length}`}
              </Typography>
            )}

            <ChevronRight />
          </IconButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
export default EventsDialog;
