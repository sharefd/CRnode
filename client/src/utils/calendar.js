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
