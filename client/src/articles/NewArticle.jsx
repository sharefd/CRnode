import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Paper, Grid, MenuItem } from '@mui/material';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useNavigate } from 'react-router';

const PURPOSE_CHOICES = {
  OM1: 'OM Half-day',
  UOFTAMR: 'UofT Aerospace Rounds',
  MACIMAHD1: 'McMaster IM PGY-1 AHD',
  MACIMAHD2: 'McMaster IM PGY-2 AHD',
  MACIMAHD3: 'McMaster IM PGY-3 AHD'
};

const NewArticle = () => {
  const navigate = useNavigate();
  const [article, setArticle] = useState({
    title: '',
    event_link: '',
    made_on: '',
    time: dayjs('2022-04-17T15:30'),
    purpose: ''
  });

  const handleSubmit = e => {
    e.preventDefault();
    axios
      .post('http://localhost:3001/api/articles/new', article)
      .then(response => {
        console.log('Article created:', response.data);
        navigate('/articles');
      })
      .catch(error => {
        console.error('There was an error creating the article:', error);
      });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper elevation={3} sx={{ padding: 4, width: '60%', margin: '0 auto', mt: 8 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant='h5'>Create Article</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Title'
                fullWidth
                value={article.title}
                onChange={e => setArticle({ ...article, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Event Link'
                fullWidth
                value={article.event_link}
                onChange={e => setArticle({ ...article, event_link: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body1'>Made On</Typography>
              <TextField
                type='date'
                fullWidth
                value={article.made_on}
                onChange={e => setArticle({ ...article, made_on: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body1'>Time</Typography>
              <TimePicker
                value={article.time}
                onChange={newValue => {
                  setArticle({ ...article, time: dayjs(newValue) });
                }}
                renderInput={params => <TextField {...params} />}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label='Purpose'
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
            <Grid item xs={12}>
              <Button type='submit' variant='contained' color='primary'>
                Create Article
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </LocalizationProvider>
  );
};

export default NewArticle;
