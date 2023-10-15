import { TableCell, Badge, Typography, Box } from '@mui/material';
import { eventColors } from '../../utils/constants';

const CalendarCell = ({ day, events, selected, setSelected }) => {
  const today = new Date().getDate();

  const handleCellClick = () => {
    setSelected(day);
  };

  const badgeStyle = {
    position: 'absolute',
    top: 22,
    right: day > 9 ? 15 : 19.5,
    opacity: selected === day ? 1 : 0.6
  };

  const cellStyle = {
    cursor: 'pointer',
    position: 'relative',
    height: '20px',
    alignItems: 'center',
    padding: '1rem',
    borderRadius: '50%'
  };

  return (
    <TableCell style={cellStyle} onClick={handleCellClick}>
      <Box
        sx={{
          display: 'flex',
          backgroundColor: selected === day ? eventColors[2] : 'transparent',
          borderRadius: '5px',
          p: '3px',
          border: day === today ? '2px solid blue' : 'none',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <Badge badgeContent={events.length} color='primary' sx={badgeStyle} />
        <Typography sx={{ fontSize: '16px', fontWeight: '700' }}>{day}</Typography>
      </Box>
    </TableCell>
  );
};

export default CalendarCell;
