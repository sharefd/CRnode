import React from 'react';
import { TableCell } from '@mui/material';

const colors = ['#0056b3', '#2673FF', '#4D9BFF', '#80C7FF', '#B3E0FF'];

const CalendarCell = ({ day, events }) => {
  return (
    <TableCell>
      {day}
      <div className='events-container'>
        {events.slice(0, 5).map((event, index) => (
          <div key={index} className='event-circle' style={{ backgroundColor: colors[index] }}></div>
        ))}
      </div>
    </TableCell>
  );
};

export default CalendarCell;
