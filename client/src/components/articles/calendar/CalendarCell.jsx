import React, { useState } from 'react';
import { TableCell, Badge, Typography, Box, Dialog, DialogContent, IconButton, Button } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import LinkIcon from '@mui/icons-material/Link';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HttpsIcon from '@mui/icons-material/Https';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import GroupsIcon from '@mui/icons-material/Groups';
import { formatDate } from '@/utils/dates';

import { purposeIcons } from '@/components/ui/PurposeIcons';

const CalendarCell = ({ day, month, year, events, setSelected }) => {
  const [open, setOpen] = useState(false);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  const today = new Date();
  // today.setHours(0, 0, 0, 0);
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const cellDate = new Date(year, month, day);
  // cellDate.setHours(0, 0, 0, 0);

  // const isPastDate = cellDate < today;

  const handleCellClick = () => {
    setSelected(day);
    if (events.length === 0) return;
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentEventIndex(0);
  };

  const handleNextEvent = () => {
    setCurrentEventIndex(prevIndex => Math.min(prevIndex + 1, events.length - 1));
  };

  const handlePrevEvent = () => {
    setCurrentEventIndex(prevIndex => Math.max(prevIndex - 1, 0));
  };

  const badgeStyle = {
    position: 'absolute',
    top: 15,
    right: day > 9 ? 15 : 19.5
    //    opacity: selected === day ? 1 : 0.8
  };

  const cellStyle = {
    cursor: 'pointer',
    position: 'relative',
    height: '20px',
    alignItems: 'center',
    padding: '1rem',
    borderRadius: '50%',
    textDecoration: 'none',
    color: 'inherit'
  };

  const article = events[currentEventIndex] || {};

  const [isCopied, setIsCopied] = useState(false);

  const handleCopyToClipboard = text => {
    navigator.clipboard.writeText(text).then(
      function () {
        // Successfully copied to clipboard
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 600); // Reset the state after 2 seconds
        console.log('Link copied to clipboard');
      },
      function (err) {
        // Unable to copy to clipboard
        console.error('Failed to copy link to clipboard', err);
      }
    );
  };

  return (
    <>
      <TableCell style={cellStyle} onClick={handleCellClick}>
        <Box
          sx={{
            display: 'flex',
            backgroundColor:
              day === currentDay && month === currentMonth && year === currentYear ? '#318CE7' : 'transparent',
            borderRadius: '5px',
            p: '3px',
            border: day === currentDay && month === currentMonth && year === currentYear ? '2px ridge black' : 'none',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <Badge badgeContent={events.length} color='primary' sx={badgeStyle} />
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: '700',
              color: day === currentDay && month === currentMonth && year === currentYear ? 'white' : 'inherit'
            }}>
            {day}
          </Typography>
        </Box>
      </TableCell>

      <Dialog open={open} onClose={handleClose} sx={{ overflow: 'hidden' }}>
        <DialogContent className='modal-title' sx={{ padding: '20px', overflow: 'hidden' }}>
          <Typography variant='h6' sx={{ marginBottom: '20px' }}>
            {article.title}
          </Typography>
          <Box className='modal-purpose'>
            <Box className='event-purpose-badge'>
              {purposeIcons[article.purpose && article.purpose.name] || purposeIcons.DEFAULT}
              <span style={{ fontSize: '13px' }}>{article.purpose && article.purpose.name}</span>
            </Box>
          </Box>
          <Box className='modal-info'>
            <Box className='modal-purpose'>
              <AccessTimeIcon sx={{ mr: 2 }} />
              <span className='modal-purpose-date'>{formatDate(article.date)}</span>
              <span className='modal-purpose-at'>@</span>
              <span className='modal-purpose-time'>{article.duration}</span>
            </Box>

            {isCopied && <div className='copied-message'>Copied</div>}
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
                onClick={() => handleCopyToClipboard(article.event_link)}>
                <ContentCopyIcon sx={{ mr: 1 }} /> Copy Link
              </Button>
              <Button
                variant='outlined'
                onClick={() => window.open(article.event_link, '_blank')}
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
              <span>Meeting ID: {article.meeting_id || 'None'}</span>
              <span className='modal-purpose-at'>|</span>
              <span>Passcode: {article.passcode || 'None'}</span>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <IconButton onClick={handlePrevEvent} disabled={currentEventIndex === 0}>
              <ChevronLeft />
            </IconButton>
            <IconButton onClick={handleNextEvent} disabled={currentEventIndex === events.length - 1}>
              {/* Add a badge to show event number out of the total events */}
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
    </>
  );
};

export default CalendarCell;
