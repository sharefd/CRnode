import { observer } from 'mobx-react';
import ActionBar from '../actions/ActionBar';
import { useState } from 'react';
import { deleteArticle, sortArticles, updateArticle } from '@/services/articles';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Typography, Box, Dialog, DialogContent, IconButton, Button, CircularProgress } from '@mui/material';
import { purposeIcons } from '@/components/ui/PurposeIcons';
import { useAllowedArticles } from '@/hooks/useAllowedArticles';
import userStore from '@/stores/userStore';
import { useMutation } from 'react-query';
import {
  AccessTime as AccessTimeIcon,
  ChevronLeft,
  ChevronRight,
  ContentCopy as ContentCopyIcon,
  Groups as GroupsIcon,
  Https as HttpsIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { convertTo24Hour } from '@/utils/dates';

const localizer = momentLocalizer(moment);

const BigCalendar = observer(() => {
  const user = userStore.user;
  const [selected, setSelected] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState({});
  const [open, setOpen] = useState(false);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [selectedPurposes, setSelectedPurposes] = useState(['Show All']);
  const [openNewArticleModal, setOpenNewArticleModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [date, setDate] = useState(new Date());

  const { allowedArticles, isLoading } = useAllowedArticles();

  const events = allowedArticles.map(article => {
    const startTime24 = convertTo24Hour(article.time);
    return {
      title: article.purpose,
      start: new Date(`${article.dateString}T${startTime24}`),
      end: new Date(`${article.dateString}T${startTime24}`),
      allDay: false,
      resource: article
    };
  });

  console.log(events);

  const handleClose = () => {
    setOpen(false);
    setCurrentEventIndex(0);
  };

  const handleNextEvent = () => {
    setCurrentEventIndex(prevIndex => Math.min(prevIndex + 1, events.length - 1));
  };

  const handlePrevEvent = () => {
    setCurrentEventIndex(prevIndex => Math.max(prevIndex - 1, 0));
  };

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

  const toggleNewArticleModal = () => {
    setOpenNewArticleModal(!openNewArticleModal);
  };

  const handleCopyToClipboard = text => {
    navigator.clipboard.writeText(text).then(
      function () {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 600); // Reset the state after 2 seconds
        console.log('Link copied to clipboard');
      },
      function (err) {
        console.error('Failed to copy link to clipboard', err);
      }
    );
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
        toggleNewArticleModal={toggleNewArticleModal}
      />
      <Box px={2}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor='start'
          endAccessor='end'
          style={{ height: 500 }}
          onSelectEvent={event => {
            const article = event.resource;
            setSelectedArticle(article);
            if (events.length === 0) return;
            setOpen(true);
          }}
        />
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent className='modal-title' sx={{ padding: '20px' }}>
          <Typography variant='h6' sx={{ marginBottom: '25px' }}>
            {selectedArticle.title}
          </Typography>
          <Box className='modal-info' sx={{ marginBottom: '30px' }}>
            <p className='modal-purpose'>
              <AccessTimeIcon />
              {'\u00A0'}
              {'\u00A0'}
              {'\u00A0'}
              {selectedArticle.dateString} {'\u00A0'} |{'\u00A0'} {'\u00A0'}
              {selectedArticle.time}
            </p>

            <p className='modal-purpose'>
              {purposeIcons[selectedArticle.purpose]} {'\u00A0'} {'\u00A0'} {selectedArticle.purpose || 'None'}
              {isCopied && <div className='copied-message'>Copied</div>}
            </p>
            <p className='modal-purpose'>
              <LinkIcon /> {'\u00A0'} {'\u00A0'}
              <Button
                variant='outlined'
                size='small'
                sx={{
                  textTransform: 'none',
                  color: 'black',
                  borderColor: 'black',
                  margin: '5px',
                  '&:hover': {
                    backgroundColor: '#07A24A',
                    color: 'white',
                    borderColor: 'black'
                  }
                }}
                onClick={() => handleCopyToClipboard(selectedArticle.event_link)}>
                <ContentCopyIcon /> {'\u00A0'} Copy Link
              </Button>
              {'\u00A0'} {'\u00A0'}
              <Button
                variant='outlined'
                onClick={() => window.open(selectedArticle.event_link, '_blank')}
                size='small'
                sx={{
                  textTransform: 'none',
                  color: 'black',
                  borderColor: 'black',
                  margin: '5px',
                  '&:hover': { backgroundColor: '#1976d2', color: 'white', borderColor: 'black' }
                }}>
                <GroupsIcon /> {'\u00A0'} Join Meeting
              </Button>
            </p>
            <p className='modal-purpose'>
              <HttpsIcon /> {'\u00A0'} {'\u00A0'} Meeting ID: {selectedArticle.meeting_id || 'None'} {'\u00A0'} |{' '}
              {'\u00A0'} {'\u00A0'}
              Passcode: {selectedArticle.passcode || 'None'}
            </p>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <IconButton onClick={handlePrevEvent} disabled={currentEventIndex === 0}>
              <ChevronLeft />
            </IconButton>
            <IconButton onClick={handleNextEvent} disabled={currentEventIndex === events.length - 1}>
              {events.length > 1 && (
                <Typography sx={{ fontSize: '14px', fontWeight: '900', color: 'black' }}>
                  {`${currentEventIndex + 1}/${events.length}`}
                </Typography>
              )}

              <ChevronRight />
            </IconButton>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default BigCalendar;
