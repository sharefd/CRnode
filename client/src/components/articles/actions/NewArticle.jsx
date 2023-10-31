import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { createArticle, sortArticles } from '@/services/articles';
import userStore from '@/stores/userStore';
import { AccessTime } from '@mui/icons-material';
import {
  Button,
  Grid,
  MenuItem,
  Modal,
  Paper,
  TextField,
  Typography,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { createPurpose } from '@/services/purposes';

const NewArticle = ({ open, onClose, canWritePurposes, refetch, setLocalArticles, refetchPurposes }) => {
  const currentUser = userStore.user;
  const [allowedPurposes, setAllowedPurposes] = useState(canWritePurposes.map(p => p.name));

  const [showAddPurposeModal, setShowAddPurposeModal] = useState(false);
  const [newPurpose, setNewPurpose] = useState({ name: '', description: '' });
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
    virtual: true
  });

  const createMutation = useMutation(createArticle, {
    onSuccess: newArticle => {
      const allArticles = [...userStore.articles, newArticle];
      const filteredArticles = allArticles.filter(a => allowedPurposes.includes(a.purpose));
      setLocalArticles(sortArticles(filteredArticles));
      onClose();
    }
  });

  const handleAddPurpose = async () => {
    const purposeData = {
      name: newPurpose.name,
      description: newPurpose.description,
      canReadMembers: [],
      canWriteMembers: []
    };
    await createPurpose(currentUser._id, purposeData);
    setAllowedPurposes([...allowedPurposes, newPurpose.name]);
    setNewPurpose({ name: '', description: '' });
    setShowAddPurposeModal(false);
    refetchPurposes();
  };

  const handleSubmit = async e => {
    e.preventDefault();
    console.log(article);

    let eventLink = article.event_link;
    if (!eventLink.startsWith('https://')) {
      eventLink = `https://${eventLink}`;
    }

    const formattedTime = article.time.format('hh:mm A');
    const payload = {
      ...article,
      time: formattedTime,
      organizer: currentUser._id,
      event_link: eventLink // Update the event_link with the corrected URL
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
        <Paper elevation={3} sx={{ maxWidth: '600px', margin: 'auto', mt: 2.2 }}>
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
                  {canWritePurposes.map((purpose, index) => (
                    <MenuItem key={index} value={purpose.name}>
                      {purpose.description}
                    </MenuItem>
                  ))}
                  <MenuItem key='add-new-purpose' value='null' onClick={() => setShowAddPurposeModal(true)}>
                    + Add New Purpose
                  </MenuItem>
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
                          value={article.duration || 60}
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
      <Dialog open={showAddPurposeModal} onClose={() => setShowAddPurposeModal(false)}>
        <DialogTitle>Add New Purpose</DialogTitle>
        <DialogContent>
          <DialogContentText>Provide a name and description for the new purpose.</DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            label='Purpose Name'
            fullWidth
            value={newPurpose.name}
            onChange={e => setNewPurpose({ ...newPurpose, name: e.target.value })}
          />
          <TextField
            margin='dense'
            label='Description'
            fullWidth
            value={newPurpose.description}
            onChange={e => setNewPurpose({ ...newPurpose, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddPurposeModal(false)} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleAddPurpose} color='primary'>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default NewArticle;
