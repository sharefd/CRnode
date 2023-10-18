import { Button, Grid, MenuItem, Paper, TextField, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useRecoilValue, useRecoilState } from 'recoil';
import { articlesState, userState } from '../appState';
import { PURPOSE_CHOICES } from '../utils/constants';
import LoadingSpinner from '../helpers/LoadingSpinner';
import AccessDenied from '../auth/AccessDenied';

const NewArticle = () => {
  const navigate = useNavigate();
  const currentUser = useRecoilValue(userState);
  const [articles, setArticles] = useRecoilState(articlesState);
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

  const handleSubmit = async e => {
    e.preventDefault();
    const formattedTime = article.time.format('hh:mm A'); // Output will be like "02:30 PM"
    const payload = {
      ...article,
      time: formattedTime,
      organizer: currentUser?._id || ''
    };
    console.log(payload, currentUser);

    if (!payload.title) {
      console.error('Title is required');
      return;
    }

    axios
      .post('http://localhost:3001/api/articles/new', payload)
      .then(response => {
        console.log('Article created:', response.data);
        setArticles(articles.concat(response.data));
        navigate('/articles');
      })
      .catch(error => {
        console.error('There was an error creating the article:', error);
      });
  };

<<<<<<< HEAD
if (!currentUser) {
=======
  if (!currentUser) {
>>>>>>> d97617f1d08da572cfbcb8fc6d3d437a12013b0b
    return <LoadingSpinner />;
  } else {
    if (!currentUser.isAdmin) {
      return <AccessDenied />;
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper elevation={3} sx={{ width: '50%', margin: '0 auto', mt: 8 }}>
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
            <Grid item xs={6}>
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
                label='Event Link'
                required
                fullWidth
                value={article.event_link}
                onChange={e => setArticle({ ...article, event_link: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                label='Purpose'
                required
                fullWidth
                value={article.purpose}
                onChange={e => setArticle({ ...article, purpose: e.target.value })}>
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
                value={article.dateString}
                onChange={e => setArticle({ ...article, dateString: e.target.value })}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant='body1'></Typography>
              <TimePicker
                value={article.time}
                onChange={newValue => {
                  setArticle({ ...article, time: dayjs(newValue) });
                }}
                slotProps={{ textField: { variant: 'outlined' } }}
                sx={{ overflow: 'hidden' }}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                label='Speaker'
                fullWidth
                value={article.speaker}
                onChange={e => setArticle({ ...article, speaker: e.target.value })}
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

            <Grid item xs={6}>
              <TextField
                label='Meeting ID'
                fullWidth
                value={article.meeting_id}
                onChange={e => setArticle({ ...article, meeting_id: e.target.value })}
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

            <Grid item xs={12}>
              <Button type='submit' variant='contained' color='primary'>
                Create Article
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ padding: 4 }}></Grid>
        </form>
      </Paper>
    </LocalizationProvider>
  );
};

export default NewArticle;
