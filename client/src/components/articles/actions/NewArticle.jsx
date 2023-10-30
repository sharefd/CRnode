import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { createArticle } from '@/services/articles';
import { fetchCanWritePermissions } from '@/services/permissions';
import userStore from '@/stores/userStore';
import { PURPOSE_CHOICES } from '@/utils/constants';
import { AccessTime } from '@mui/icons-material';
import {
  Button,
  Grid,
  MenuItem,
  Modal,
  Paper,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Input
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useMutation } from 'react-query';

const NewArticle = ({ open, onClose, permissions, refetch }) => {
  const currentUser = userStore.user;

  const [article, setArticle] = useState({
    title: '',
    event_link: '',
    dateString: '',
    time: dayjs('2022-04-17T15:30'),
    purpose: '',
    duration: 60,
    meeting_id: '',
    passcode: '',
    speaker: '',
    additional_details: '',
    location: '',
    virtual: true // Added toggle state
  });

  const allowedPurposes = permissions ? fetchCanWritePermissions(permissions) : [];

  const createMutation = useMutation(createArticle, {
    onSuccess: newArticle => {
      userStore.setArticles([...userStore.articles, newArticle]);
      refetch();
      onClose();
    }
  });

  const handleSubmit = async e => {
    e.preventDefault();
    const formattedTime = article.time.format('hh:mm A'); // Output will be like "02:30 PM"
    const payload = {
      ...article,
      time: formattedTime,
      organizer: currentUser._id
    };

    if (!payload.title) {
      console.error('Title is required');
      return;
    }

    createMutation.mutate(payload);
  };

  if (!currentUser || !allowedPurposes) {
    return <LoadingSpinner />;
  }

  const handleToggleChange = () => {
    setArticle({ ...article, virtual: !article.virtual }); // Use 'virtual' here
  };

  const formatDuration = duration => {
    const hours = Math.floor(duration / 60);
    const mins = duration % 60;

    if (mins === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${mins}m`;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Modal open={open} onClose={onClose} sx={{ overflow: 'scroll' }}>
        <Paper elevation={3} sx={{ width: '60%', margin: '0 auto', mt: 2.2 }}>
          <Grid item xs={12}>
            <Typography
              variant='h5'
              align='center'
              sx={{
                backgroundColor: '#0066b2',
                color: '#fff',
                borderTopRightRadius: '5px',
                borderTopLeftRadius: '5px',
                padding: '0.7rem'
              }}>
              Create Event
            </Typography>
          </Grid>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{ padding: 4, maxWidth: '705px' }}>
              <Grid item xs={12}>
                <TextField
                  label='Title'
                  required
                  fullWidth
                  value={article.title}
                  onChange={e => setArticle({ ...article, title: e.target.value })}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  select
                  label='Purpose'
                  required
                  fullWidth
                  value={article.purpose}
                  onChange={e => setArticle({ ...article, purpose: e.target.value })}>
                  {allowedPurposes.map((key, index) => (
                    <MenuItem key={index} value={key}>
                      {PURPOSE_CHOICES[key]}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label='Speaker'
                  fullWidth
                  value={article.speaker}
                  onChange={e => setArticle({ ...article, speaker: e.target.value })}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  type='date'
                  fullWidth
                  value={article.dateString}
                  onChange={e => setArticle({ ...article, dateString: e.target.value })}
                />
              </Grid>

              <Grid item xs={6}>
                <TimePicker
                  value={article.time}
                  onChange={newValue => {
                    setArticle({ ...article, time: dayjs(newValue) });
                  }}
                  slotProps={{ textField: { variant: 'outlined' } }}
                  sx={{ overflow: 'hidden', width: '100%' }}
                />
              </Grid>
              <Grid container spacing={2} sx={{ paddingX: 3, my: 1, alignItems: 'center' }}>
                <Grid item xs={7}>
                  <Box sx={{ width: 350 }}>
                    <Typography id='duration-slider' gutterBottom sx={{ mb: 1.5 }}>
                      Duration
                    </Typography>
                    <Grid container spacing={2} alignItems='center'>
                      <Grid item xs={1} sx={{ mb: '8px', mr: '6px' }}>
                        <AccessTime />
                      </Grid>
                      <Grid item xs={7}>
                        <Slider
                          value={article.duration}
                          onChange={(e, newValue) => setArticle({ ...article, duration: newValue })}
                          step={15}
                          min={15}
                          max={240}
                          aria-labelledby='input-slider'
                        />
                      </Grid>
                      <Grid item xs={2.5} sx={{ mb: '8px' }}>
                        <Typography sx={{ fontSize: '14px' }}>{formatDuration(article.duration)}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={5} sx={{ mt: 2 }}>
                  <ToggleButtonGroup
                    value={article.virtual}
                    exclusive
                    onChange={handleToggleChange}
                    aria-label='meeting type'
                    size='small'>
                    <ToggleButton value={true} aria-label='virtual'>
                      Virtual Meeting
                    </ToggleButton>
                    <ToggleButton value={false} aria-label='in-person'>
                      In-Person Meeting
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
              </Grid>
              {article.virtual ? (
                <Grid item xs={12}>
                  <TextField
                    label='Event Link (Virtual Meeting)'
                    required
                    fullWidth
                    value={article.event_link}
                    onChange={e => setArticle({ ...article, event_link: e.target.value })}
                  />
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <TextField
                    label='Location (In-Person Meeting)'
                    required
                    fullWidth
                    value={article.location}
                    onChange={e => setArticle({ ...article, location: e.target.value })}
                  />
                </Grid>
              )}

              {article.virtual && (
                <Grid item xs={6}>
                  <TextField
                    label='Meeting ID'
                    fullWidth
                    value={article.meeting_id}
                    onChange={e => setArticle({ ...article, meeting_id: e.target.value })}
                  />
                </Grid>
              )}

              {article.virtual && (
                <Grid item xs={6}>
                  <TextField
                    label='Passcode'
                    fullWidth
                    value={article.passcode}
                    onChange={e => setArticle({ ...article, passcode: e.target.value })}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  label='Addtional Details (e.g. required readings, preparation material)'
                  fullWidth
                  multiline
                  rows={4}
                  value={article.additional_details}
                  onChange={e => setArticle({ ...article, additional_details: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Button type='submit' variant='contained' color='primary'>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Modal>
    </LocalizationProvider>
  );
};

export default NewArticle;
