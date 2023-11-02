import { convertTo24Hour } from '@/utils/dates';

export const getVisibleHours = events => {
  const visibleHours = [];
  events.forEach(event => {
    const startHour = event.start.getHours();
    const endHour = event.end.getHours();
    for (let i = startHour; i < endHour; i++) {
      if (!visibleHours.includes(i)) {
        visibleHours.push(i);
      }
    }
  });
  return visibleHours.sort((a, b) => a - b);
};

export const getMaxHour = visibleHours => {
  const maxHour = (visibleHours[visibleHours.length - 1] || 0) + 1;
  const max = new Date(2022, 0, 1, maxHour > 23 ? 23 : maxHour);
  return max;
};

export const formatDuration24Hour = article => {
  const startTime24 = convertTo24Hour(article.time);
  const startDate = article.date;
  const duration = article.duration || 60;
  const endDate = new Date(startDate);
  endDate.setMinutes(startDate.getMinutes() + duration);
  const endTime24 = `${endDate.getHours().toString().padStart(2, '0')}:${endDate
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;

  return `${startTime24}-${endTime24}`;
};

export const formatDuration12Hour = article => {
  const startTime = convertStringToTime(article.time);
  const duration = article.duration || 60;
  const endTime = new Date(startTime.getTime() + duration * 60000);

  const startTime12 = convertTo12Hour(startTime);
  const endTime12 = convertTo12Hour(endTime);

  return `${startTime12}-${endTime12}`;
};

const convertStringToTime = timeStr => {
  const [time, meridiem] = timeStr.split(' ');
  const [hours, minutes] = time.split(':').map(Number);

  const date = new Date();
  date.setHours(meridiem === 'AM' ? hours : hours + 12);
  date.setMinutes(minutes);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
};

const convertTo12Hour = date => {
  let hours = date.getHours();
  const minutes = date.getMinutes();

  const meridiem = hours >= 12 ? 'PM' : 'AM';

  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;

  const zeroPaddedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${hours}:${zeroPaddedMinutes} ${meridiem}`;
};

export const formatDuration = duration => {
  const hours = Math.floor(duration / 60);
  const mins = duration % 60;

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
};
