import moment from 'moment-timezone';

export const compareDates = (a, b) => {
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);

  if (dateA < dateB) return -1;
  if (dateA > dateB) return 1;

  const timeToMinutes = timeString => {
    const [hoursStr, minutesStr] = timeString.split(':');
    let [minutes, period] = minutesStr.split(' ');
    let hours = parseInt(hoursStr, 10);

    if (period === 'PM' && hours !== 12) {
      hours += 12;
    }
    if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    return hours * 60 + parseInt(minutes, 10);
  };

  const minutesA = a.time ? timeToMinutes(a.time) : 0;
  const minutesB = b.time ? timeToMinutes(b.time) : 0;

  return minutesA - minutesB;
};

export const formatDate = dateString => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export function formatDateToReadable(date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dateParts = date.toString().split('-');
  const year = dateParts[0];
  const month = months[parseInt(dateParts[1]) - 1]; // months are 0-indexed in JS
  const day = parseInt(dateParts[2]); // remove leading zero if any

  return `${month} ${day}, ${year}`;
}

export function convertTo24Hour(timeStr) {
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':');

  if (period.toLowerCase() === 'pm' && parseInt(hours) !== 12) {
    hours = parseInt(hours) + 12;
  } else if (period.toLowerCase() === 'am' && parseInt(hours) === 12) {
    hours = '00';
  }

  return `${hours}:${minutes}`;
}
