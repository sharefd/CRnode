import moment from 'moment-timezone';

export const compareDates = (a, b) => {
  const dateA = new Date(a.made_on);
  const dateB = new Date(b.made_on);
  if (dateA < dateB) return -1;
  if (dateA > dateB) return 1;

  const timeA = a.time ? a.time.split(':').join('') : '';
  const timeB = b.time ? b.time.split(':').join('') : '';

  return timeA.localeCompare(timeB);
};

export const formatDate = article => {
  const dateTime = `${article.made_on.split('T')[0]} ${article.time}`;
  const date = moment.tz(dateTime, 'YYYY-MM-DD hh:mm A', 'UTC').tz('America/New_York');
  const formattedDate = date.format('MMMM D, YYYY');
  return formattedDate;
};
