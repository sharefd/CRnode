import useArticlePermissions from '@/hooks/useArticlePermissions';
import { deleteArticle, updateArticle } from '@/services/articles';
import userStore from '@/stores/userStore';
import { formatArticlesToEvents, getMaxHour, getVisibleHours } from '@/utils/calendar';
import { Box, CircularProgress } from '@mui/material';
import { observer } from 'mobx-react';
import moment from 'moment';
import { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useMutation } from 'react-query';
import ActionBar from '../actions/ActionBar';
import EditArticleModal from '../actions/EditArticleModal';
import NewArticle from '../actions/NewArticle';
import EventsDialog from './EventsDialog';

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

  const { allowedArticles, permissions, isLoading, refetch } = useArticlePermissions(user._id);

  const events = formatArticlesToEvents(allowedArticles);

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

  const visibleHours = getVisibleHours(events);

  const filterEventsForDay = eventDate => {
    const filtered = events.filter(event => {
      return (
        eventDate.getDate() === event.start.getDate() &&
        eventDate.getMonth() === event.start.getMonth() &&
        eventDate.getFullYear() === event.start.getFullYear()
      );
    });

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
          max={getMaxHour(visibleHours)}
          onSelectEvent={event => {
            const article = event.resource;
            setSelectedDate(event.start);
            const eventsForDay = filterEventsForDay(event.start);
            setFilteredEvents(eventsForDay);
            if (eventsForDay.length === 0) return;

            const index = eventsForDay.findIndex(e => e.resource._id === article._id);
            setSelectedEventIndex(index >= 0 ? index : 0);
            setSelectedArticle(eventsForDay[index].resource);
            setOpen(true);
          }}
        />
      </Box>
      {filteredEvents.length > 0 && selectedDate && (
        <EventsDialog
          open={open}
          setOpen={setOpen}
          events={filteredEvents}
          initialIndex={selectedEventIndex}
          selectedArticle={selectedArticle}
          setSelectedArticle={setSelectedArticle}
        />
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
