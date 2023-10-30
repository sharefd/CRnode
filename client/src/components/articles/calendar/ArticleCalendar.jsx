import { useState } from 'react';
import { Button, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import CalendarCell from './CalendarCell';
import { monthNames } from '../../../utils/constants';

const ArticleCalendar = ({ articles }) => {
  const [date, setDate] = useState(new Date());
  const [selected, setSelected] = useState(false);

  const changeMonth = offset => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + offset);
    setDate(newDate);
  };

  const goToToday = () => {
    setDate(new Date()); // Set the date to the current date
    setSelected(false); // Clear the selected date
  };

  const month = date.getMonth();
  const year = date.getFullYear();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const filteredArticles = articles.filter(article => {
    const articleDate = new Date(`${article.dateString}T12:00:00`);
    return articleDate.getMonth() === month && articleDate.getFullYear() === year;
  });

  const generateCalendarCells = () => {
    let rows = [];
    let day = 1;

    for (let i = 0; i < 6; i++) {
      let cells = [];

      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          cells.push(<TableCell key={j}></TableCell>);
        } else if (day > lastDate) {
          cells.push(<TableCell key={j}></TableCell>);
        } else {
          const cellDate = new Date(year, month, day);
          const eventsOnThisDay = filteredArticles.filter(article => {
            const articleDate = new Date(`${article.dateString}T12:00:00`);
            return articleDate.toDateString() === cellDate.toDateString();
          });

          cells.push(
            <CalendarCell
              key={j}
              day={day}
              month={month}
              year={year}
              events={eventsOnThisDay}
              setSelected={setSelected}
            />
          );
          day++;
        }
      }

      rows.push(<TableRow key={i}>{cells}</TableRow>);
    }

    return rows;
  };

  return (
    <div id='calendar-container'>
      <div
        id='calendar-head'
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#1976d2', // Background color
          borderRadius: '20px', // Adjust the value to your desired level of rounding
          color: 'white',
            minWidth: '420px' // Set the minimum width you desire, e.g., 200px
          
        }}>
        <Button id='prev-month' onClick={() => changeMonth(-1)} style={{}}>
          <ChevronLeft />
        </Button>

        <Button
          variant='outlined'
          size='small'
          sx={{
            textTransform: 'none',
            color: '#1976d2',
            borderColor: 'white',
            backgroundColor: 'white',
            '&:hover': {
              backgroundColor: '#F5F5F5',
              color: '#1976d2',
              borderColor: 'white'
            }
          }}
          onClick={goToToday}>
          TODAY
        </Button>

        <span
          id='current-month-year'
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            marginRight: '45px' // Adjust the margin value as needed
          }}>
          {`${monthNames[month]} ${year}`}
        </span>

        <Button id='next-month' onClick={() => changeMonth(1)} style={{ color: 'white' }}>
          <ChevronRight />
        </Button>
      </div>
      <Table id='calendar-body'>
        <TableHead>
          <TableRow id='calendar-weekday'>
            <TableCell>Sun</TableCell>
            <TableCell>Mon</TableCell>
            <TableCell>Tue</TableCell>
            <TableCell>Wed</TableCell>
            <TableCell>Thu</TableCell>
            <TableCell>Fri</TableCell>
            <TableCell>Sat</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{generateCalendarCells()}</TableBody>
      </Table>
    </div>
  );
};

export default ArticleCalendar;
