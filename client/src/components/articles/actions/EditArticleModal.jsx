import { Delete, Save } from '@mui/icons-material';
import { Button, Grid, MenuItem, Modal, Paper, TextField, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { PURPOSE_CHOICES } from '../../../utils/constants';

const EditArticleModal = ({ open, onClose, article, onSave, onDelete }) => {
  const [editedArticle, setEditedArticle] = useState(article);

  useEffect(() => {
    if (article && article.time) {
      setEditedArticle({ ...article, time: dayjs(article.time, 'hh:mm A') });
    }
  }, [article]);

  const handleSave = async e => {
    e.preventDefault();
    const formattedTime = editedArticle.time.format('hh:mm A');
    onSave({
      ...editedArticle,
      time: formattedTime
    });
  };

  if (!editedArticle) {
    return null;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Modal open={open} onClose={onClose}>
        <Paper elevation={3} sx={{ width: '50%', margin: '0 auto', mt: 12 }}>
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
              Edit Article
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'right', pr: 4, pt: 1 }}>
            <Button
              sx={{ marginLeft: 'auto', backgroundColor: 'gray', color: '#fff', '&:hover': { backgroundColor: 'red' } }}
              variant='contained'
              startIcon={<Delete />}
              onClick={() => onDelete(article._id)}>
              Delete
            </Button>
          </Grid>

          <form onSubmit={handleSave}>
            <Grid container spacing={3} sx={{ padding: 4 }}>
              <Grid item xs={6}>
                <TextField
                  label='Title'
                  required
                  fullWidth
                  value={editedArticle.title}
                  onChange={e => setEditedArticle({ ...editedArticle, title: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label='Event Link'
                  required
                  fullWidth
                  value={editedArticle.event_link}
                  onChange={e => setEditedArticle({ ...editedArticle, event_link: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  label='Purpose'
                  required
                  fullWidth
                  value={editedArticle.purpose}
                  onChange={e => setEditedArticle({ ...editedArticle, purpose: e.target.value })}>
                  {Object.keys(PURPOSE_CHOICES).map((key, index) => (
                    <MenuItem key={index} value={key}>
                      {PURPOSE_CHOICES[key]}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={4}>
                <Typography variant='body1'></Typography>
                <TextField
                  type='date'
                  fullWidth
                  value={editedArticle.dateString}
                  onChange={e => setEditedArticle({ ...editedArticle, dateString: e.target.value })}
                />
              </Grid>
              <Grid item xs={4}>
                <Typography variant='body1'></Typography>
                <TimePicker
                  value={editedArticle.time}
                  onChange={newValue => {
                    setEditedArticle({ ...editedArticle, time: dayjs(newValue) });
                  }}
                  slotProps={{ textField: { variant: 'outlined' } }}
                  sx={{ overflow: 'hidden' }}
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  label='Speaker'
                  fullWidth
                  value={editedArticle.speaker}
                  onChange={e => setEditedArticle({ ...editedArticle, speaker: e.target.value })}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label='Passcode'
                  fullWidth
                  value={editedArticle.passcode}
                  onChange={e => setEditedArticle({ ...editedArticle, passcode: e.target.value })}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label='Meeting ID'
                  fullWidth
                  value={editedArticle.meeting_id}
                  onChange={e => setEditedArticle({ ...editedArticle, meeting_id: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label='Addtional Details (e.g. required readings, preparation material)'
                  fullWidth
                  multiline
                  rows={4}
                  value={editedArticle.additional_details}
                  onChange={e => setEditedArticle({ ...editedArticle, additional_details: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} container justifyContent='center'>
                <Button type='submit' variant='contained' color='primary' startIcon={<Save />}>
                  Save Changes
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Modal>
    </LocalizationProvider>
  );
};

export default EditArticleModal;
