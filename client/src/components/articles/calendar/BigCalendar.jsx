import { useAllowedArticles } from '@/hooks/useAllowedArticles';
import { deleteArticle, updateArticle } from '@/services/articles';
import userStore from '@/stores/userStore';
import { Box, CircularProgress, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import moment from 'moment';
import { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { useMutation } from 'react-query';
import ActionBar from '../actions/ActionBar';
import { convertTo24Hour } from '@/utils/dates';
import EditArticleModal from '../actions/EditArticleModal';
import NewArticle from '../actions/NewArticle';
import EventsDialog from './EventsDialog';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const BigCalendar = observer(() => {
  const user = userStore.user;
  const [selectedArticle, setSelectedArticle] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedPurposes, setSelectedPurposes] = useState(['Show All']);
  const [openNewArticleModal, setOpenNewArticleModal] = useState(false);
  const [openEditArticleModal, setOpenEditArticleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEventIndex, setSelectedEventIndex] = useState(null);

  const { allowedArticles, permissions, isLoading, refetch } = useAllowedArticles();

  const events = allowedArticles.map(article => {
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

  const deleteMutation = useMutation(deleteArticle, {
    onSuccess: (data, variables) => {
      refetch();
    }
  });

  const updateMutation = useMutation(updateArticle, {
    onSuccess: () => {
      refetch();
    }
  });

  const handleDelete = async articleId => {
    const isConfirmed = window.confirm('Are you sure you want to delete this article?');
    if (!isConfirmed) return;

    deleteArticle(articleId);
    setSelectedArticle(null);
    deleteMutation.mutate(articleId);
  };

  const handleSave = async editedArticle => {
    await updateArticle(editedArticle);
    setSelectedArticle(null);
    updateMutation.mutate(editedArticle);
  };

  const handlePurposeChange = newPurposes => {
    if (newPurposes.includes('Show All')) {
      setSelectedPurposes(['Show All']);
    } else {
      setSelectedPurposes(newPurposes);
    }
  };

  const toggleDetails = articleId => {
    setShowDetails(prevState => ({
      ...prevState,
      [articleId]: !prevState[articleId]
    }));

    setIsExpanded(prevState => ({
      ...prevState,
      [articleId]: !prevState[articleId]
    }));
  };

  const handleEventClick = selectedEvent => {
    const article = selectedEvent.resource;
    setSelectedArticle(article);
    setSelectedDate(selectedEvent.start);
    const index = events.findIndex(event => event.resource._id === selectedEvent.resource._id);
    setSelectedEventIndex(index);
    setOpen(true);
  };

  const getVisibleHours = events => {
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

  const visibleHours = getVisibleHours(events);

  const getMaxHour = () => {
    const maxHour = (visibleHours[visibleHours.length - 1] || 0) + 1;
    const max = new Date(2022, 0, 1, maxHour > 23 ? 23 : maxHour);
    return max;
  };

  const filterEventsForDay = dateString => {
    const eventDate = new Date(dateString);
    const filtered = events.filter(event => {
      return (
        eventDate.getDate() === event.start.getDate() &&
        eventDate.getMonth() === event.start.getMonth() &&
        eventDate.getFullYear() === event.start.getFullYear()
      );
    });

    setFilteredEvents(filtered);
    return filtered;
  };

  if (isLoading) {
    return <CircularProgress />;
  }
  return (
    <div>
      <ActionBar
        user={user}
        selectedPurposes={selectedPurposes}
        handlePurposeChange={handlePurposeChange}
        toggleNewArticleModal={() => setOpenNewArticleModal(!openNewArticleModal)}
      />
      <Box px={2}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor='start'
          endAccessor='end'
          timeslots={1}
          style={{ height: 600 }}
          min={new Date(2022, 0, 1, visibleHours[0] || 0)}
          max={getMaxHour()}
          onSelectEvent={event => {
            const filteredEvents = filterEventsForDay(event.start);
            if (filteredEvents.length === 0) return;
            handleEventClick(event);
          }}
        />
      </Box>
      {filteredEvents.length > 0 && selectedDate && (
        <EventsDialog open={open} setOpen={setOpen} events={filteredEvents} initialIndex={selectedEventIndex} />
      )}
      <NewArticle
        open={openNewArticleModal}
        onClose={() => setOpenNewArticleModal(!openNewArticleModal)}
        permissions={permissions}
        refetch={refetch}
      />
      <EditArticleModal
        open={openEditArticleModal}
        onClose={() => setOpenEditArticleModal(false)}
        article={selectedArticle}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
});

export default BigCalendar;
