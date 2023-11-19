import dayjs from 'dayjs';

export const convertDurationToDateTime = (date, duration) => {
  const startTime = duration.split(' - ')[0].trim();
  return dayjs(`${date} ${startTime}`, 'YYYY-MM-DD h:mm A');
};

export const compareDates = (a, b) => {
  const dateA = dayjs(a.date);
  const dateB = dayjs(b.date);

  if (dateA.isBefore(dateB, 'day')) return -1;
  if (dateA.isAfter(dateB, 'day')) return 1;

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

  const startTimeA = a.duration.split(' - ')[0];
  const startTimeB = b.duration.split(' - ')[0];
  const minutesA = timeToMinutes(startTimeA);
  const minutesB = timeToMinutes(startTimeB);

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

export const formatTime = time => {
  const timeParts = time.split(':');
  const hour = timeParts[0];
  const mins = timeParts[1].split(' ')[0];
  const ampm = timeParts[1].split(' ')[1];
  return `${hour}:${mins.length < 2 ? `0${mins}` : mins} ${ampm}`;
};

export function extractTimesFromDuration(duration) {
  const [startStr, endStr] = duration.split(' - ');
  const startTime = dayjs(startStr, 'hh:mm A');
  const endTime = dayjs(endStr, 'hh:mm A');
  return [startTime, endTime];
}
