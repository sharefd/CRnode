import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { createArticle } from '@/services/articles';
import { fetchCanWritePermissions } from '@/services/permissions';
import userStore from '@/stores/userStore';
import { PURPOSE_CHOICES } from '@/utils/constants';
import { Button, Grid, MenuItem, Modal, Paper, TextField, Typography } from '@mui/material';
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
    meeting_id: '',
    passcode: '',
    speaker: '',
    additional_details: ''
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Modal open={open} onClose={onClose}>
        <Paper elevation={3} sx={{ width: '60%', margin: '0 auto', mt: 8 }}>
          <Grid item xs={12}>
            <Typography
              variant='h5'
              align='center'
              sx={{
                backgroundColor: '#0066b2',
                color: '#fff',
                borderTopRightRadius: '5px',
                borderTopLeftRadius: '5px',
                padding: '1rem',
                mb: 2
              }}>
              Create Article
            </Typography>
          </Grid>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3} sx={{ padding: 4 }}>
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
                  {Object.keys(PURPOSE_CHOICES).map((key, index) => (
                    <MenuItem key={index} value={key} disabled={!allowedPurposes.includes(key)}>
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

              <Grid item xs={12}>
                <TextField
                  label='Event Link'
                  required
                  fullWidth
                  value={article.event_link}
                  onChange={e => setArticle({ ...article, event_link: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label='Meeting ID'
                  fullWidth
                  value={article.meeting_id}
                  onChange={e => setArticle({ ...article, meeting_id: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label='Passcode'
                  fullWidth
                  value={article.passcode}
                  onChange={e => setArticle({ ...article, passcode: e.target.value })}
                />
              </Grid>

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

              <Grid item xs={12} sx={{ textAlign: 'center', my: 1.5 }}>
                <Button type='submit' variant='contained' color='primary'>
                  Create Article
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
