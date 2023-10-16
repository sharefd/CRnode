import React, { useState } from 'react';
import { TableCell, Badge, Typography, Box, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { eventColors } from '../../utils/constants';
import './Modal.css';
import { formatDate } from '../../utils/dates';

const CalendarCell = ({ day, events, selected, setSelected }) => {
  const [open, setOpen] = useState(false);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  const today = new Date().getDate();

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
    right: day > 9 ? 15 : 19.5,
//    opacity: selected === day ? 1 : 0.6
  };

  const cellStyle = {
    cursor: 'pointer',
    position: 'relative',
    height: '20px',
    alignItems: 'center',
    padding: '1rem',
    borderRadius: '50%'
  };

  const article = events[currentEventIndex] || {};
  const formattedDate = article.made_on?.split('T')[0];

  return (
    <>
      <TableCell style={cellStyle} onClick={handleCellClick}>
        <Box
          sx={{
            display: 'flex',
            backgroundColor: selected === day ? eventColors[2] : 'transparent',
            borderRadius: '5px',
            p: '3px',
            border: day === today ? '2px solid black' : 'none',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <Badge badgeContent={events.length} color='primary' sx={badgeStyle} />
          <Typography sx={{ fontSize: '16px', fontWeight: '700' }}>{day}</Typography>
        </Box>
      </TableCell>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle className='modal-title'>{article.title}</DialogTitle>
        <DialogContent>
          <Box className='modal-info'>
            <p className='modal-purpose'>
              Purpose: <span>{article.purpose || 'None'}</span>
            </p>
            <p>
              Event link:
              <a className='modal-event-link' href={article.event_link}>
                Here
              </a>
            </p>
            <p className='id-pass'>Meeting ID: {article.meeting_id || 'None'}</p>
            <p className='id-pass'>Passcode: {article.passcode || 'None'}</p>
            <p className='date-time'>Date: {formattedDate}</p>
            <p className='date-time'>Time: {article.time}</p>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <IconButton onClick={handlePrevEvent} disabled={currentEventIndex === 0}>
              <ChevronLeft />
            </IconButton>
            <IconButton onClick={handleNextEvent} disabled={currentEventIndex === events.length - 1}>
              <ChevronRight />
            </IconButton>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CalendarCell;
