import moment from 'moment-timezone';

export const compareDates = (a, b) => {
  const dateA = new Date(a.dateString);
  const dateB = new Date(b.dateString);

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

export const formatDate = article => {
  const dateTime = `${article.dateString} ${article.time}`;
  const date = moment.tz(dateTime, 'YYYY-MM-DD hh:mm A', 'UTC').tz('America/New_York');
  const formattedDate = date.format('MMMM D, YYYY');
  return formattedDate;
};

export function formatDateToReadable(dateString) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dateParts = dateString.split('-');
  const year = dateParts[0];
  const month = months[parseInt(dateParts[1]) - 1]; // months are 0-indexed in JS
  const day = parseInt(dateParts[2]); // remove leading zero if any

  return `${month} ${day}, ${year}`;
}
