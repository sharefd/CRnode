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

export const formatArticlesToEvents = allowedArticles => {
  return allowedArticles.map(article => {
    const startTime24 = convertTo24Hour(article.time);
    const startDate = new Date(`${article.dateString}T${startTime24}`);

    const duration = article.duration || 60;
    const endDate = new Date(startDate);
    endDate.setMinutes(startDate.getMinutes() + duration);
    const endTime24 = `${endDate.getHours().toString().padStart(2, '0')}:${endDate
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    return {
      title: article.purpose,
      start: new Date(`${article.dateString}T${startTime24}`),
      end: new Date(`${article.dateString}T${endTime24}`),
      allDay: false,
      resource: article
    };
  });
};

export const formatDuration24Hour = article => {
  const startTime24 = convertTo24Hour(article.time);
  const startDate = new Date(`${article.dateString}T${startTime24}`);
  const duration = article.duration || 60;
  const endDate = new Date(startDate);
  endDate.setMinutes(startDate.getMinutes() + duration);
  const endTime24 = `${endDate.getHours().toString().padStart(2, '0')}:${endDate
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;

  return `${startTime24}-${endTime24}`;
};

export const convertTo12Hour = time24 => {
  const [hour, minute] = time24.split(':').map(Number);
  let period = 'AM';
  let hour12 = hour;

  if (hour >= 12) {
    period = 'PM';
    if (hour > 12) {
      hour12 = hour - 12;
    }
  } else if (hour === 0) {
    hour12 = 12;
  }

  return `${hour12.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;
};

export const formatDuration12Hour = article => {
  const startTime24 = convertTo24Hour(article.time);
  const startDate = new Date(`${article.dateString}T${startTime24}`);
  const duration = article.duration || 60;
  const endDate = new Date(startDate);
  endDate.setMinutes(startDate.getMinutes() + duration);

  const endTime24 = `${endDate.getHours().toString().padStart(2, '0')}:${endDate
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;

  const startTime12 = convertTo12Hour(startTime24);
  const endTime12 = convertTo12Hour(endTime24);

  return `${startTime12}-${endTime12}`;
};

export const formatDuration = duration => {
  const hours = Math.floor(duration / 60);
  const mins = duration % 60;

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
};
