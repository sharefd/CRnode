import { useState } from 'react';
import { Button, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import CalendarCell from './CalendarCell';
import { monthNames } from '../../utils/constants';

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
      <Button id='today-button' onClick={goToToday}>
        TODAY
      </Button>

      <div id='calendar-header'>
        <Button id='prev-month' onClick={() => changeMonth(-1)}>
          <ChevronLeft />
        </Button>

        <span id='current-month-year'>{`${monthNames[month]} ${year}`}</span>
        <Button id='next-month' onClick={() => changeMonth(1)}>
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
