import { Delete, Save } from '@mui/icons-material';
import { Box, Button, Grid, IconButton, MenuItem, Modal, Paper, TextField, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const EditArticleModal = ({ open, onClose, article, onSave, onDelete, allowedPurposes }) => {
  const [editedArticle, setEditedArticle] = useState(article);

  const handleSave = async e => {
    e.preventDefault();
    onSave(editedArticle);
  };

  if (!editedArticle) {
    return null;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Modal open={open} onClose={onClose} sx={{ overflow: 'scroll' }}>
        <Paper elevation={3} sx={{ maxWidth: '600px', margin: '0 auto', mt: 2.2 }}>
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
              Edit Article
            </Typography>
          </Grid>

          <form onSubmit={handleSave}>
            <Grid container spacing={2} sx={{ padding: 4 }}>
              <Grid item xs={12}>
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
                  select
                  label='Purpose'
                  required
                  fullWidth
                  value={editedArticle.purpose}
                  onChange={e => setEditedArticle({ ...editedArticle, purpose: e.target.value })}>
                  {allowedPurposes.map((purpose, index) => (
                    <MenuItem key={index} value={purpose.name}>
                      {purpose.description}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label='Speaker'
                  fullWidth
                  value={editedArticle.speaker}
                  onChange={e => setEditedArticle({ ...editedArticle, speaker: e.target.value })}
                />
              </Grid>

              <Grid item xs={6}>
                <Typography variant='body1'></Typography>
                <TextField
                  type='date'
                  fullWidth
                  value={editedArticle.date}
                  onChange={e => setEditedArticle({ ...editedArticle, date: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant='body1'></Typography>
                <TimePicker
                  value={editedArticle.time}
                  onChange={newValue => {
                    setEditedArticle({ ...editedArticle, time: dayjs(newValue) });
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
                  value={editedArticle.event_link}
                  onChange={e => setEditedArticle({ ...editedArticle, event_link: e.target.value })}
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
              <Grid item xs={6}>
                <TextField
                  label='Passcode'
                  fullWidth
                  value={editedArticle.passcode}
                  onChange={e => setEditedArticle({ ...editedArticle, passcode: e.target.value })}
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
              <Grid container sx={{ mt: 3.5, mb: 0.5 }}>
                <Grid item xs={4} />
                <Grid item xs={4} sx={{ textAlign: 'center' }}>
                  <Button type='submit' variant='contained' color='primary' startIcon={<Save />}>
                    Submit
                  </Button>
                </Grid>

                <Grid item xs={3.7} sx={{ textAlign: 'right' }}>
                  <IconButton
                    sx={{
                      borderRadius: '20px',
                      backgroundColor: 'gray',
                      color: '#fff',
                      '&:hover': { backgroundColor: 'red' }
                    }}
                    onClick={() => onDelete(article._id)}>
                    <Delete sx={{ fontSize: '22px' }} />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Modal>
    </LocalizationProvider>
  );
};

export default EditArticleModal;
