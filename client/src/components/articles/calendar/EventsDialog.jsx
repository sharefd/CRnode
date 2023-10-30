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
import { useEffect, useState } from 'react';
import { purposeIcons } from '@/components/ui/PurposeIcons';

const EventsDialog = ({ open, setOpen, events = [], initialIndex = 0 }) => {
  const [currentEventIndex, setCurrentEventIndex] = useState(initialIndex);
  const [currentArticle, setCurrentArticle] = useState(events[currentEventIndex].resource);
  const [isCopied, setIsCopied] = useState(false);

  console.log({ initialIndex });
  useEffect(() => {
    setCurrentEventIndex(initialIndex);
  }, [initialIndex]);

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
          <p className='modal-purpose'>
            <AccessTimeIcon />
            {'\u00A0'}
            {'\u00A0'}
            {'\u00A0'}
            {currentArticle.dateString} {'\u00A0'} |{'\u00A0'} {'\u00A0'}
            {currentArticle.time}
          </p>

          <p className='modal-purpose'>
            {purposeIcons[currentArticle.purpose]} {'\u00A0'} {'\u00A0'} {currentArticle.purpose || 'None'}
            {isCopied && <div className='copied-message'>Copied</div>}
          </p>
          <p className='modal-purpose'>
            <LinkIcon /> {'\u00A0'} {'\u00A0'}
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
              <ContentCopyIcon /> {'\u00A0'} Copy Link
            </Button>
            {'\u00A0'} {'\u00A0'}
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
              <GroupsIcon /> {'\u00A0'} Join Meeting
            </Button>
          </p>
          <p className='modal-purpose' style={{ marginBottom: 0 }}>
            <HttpsIcon /> {'\u00A0'} {'\u00A0'} Meeting ID: {currentArticle.meeting_id || 'None'} {'\u00A0'} |{' '}
            {'\u00A0'} {'\u00A0'}
            Passcode: {currentArticle.passcode || 'None'}
          </p>
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
