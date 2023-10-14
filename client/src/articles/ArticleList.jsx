import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardHeader,
  Box,
  CardContent,
  CardActions,
  Button,
  Grid,
  Typography,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import ArticleCalendar from './ArticleCalendar';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [selectedPurposes, setSelectedPurposes] = useState(['Show All']);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/articles')
      .then(response => {
        const sortedArticles = response.data.sort((a, b) => {
          const dateA = new Date(a.made_on);
          const dateB = new Date(b.made_on);

          if (dateA < dateB) return -1;
          if (dateA > dateB) return 1;

          const timeA = a.time ? a.time.split(':').join('') : '';
          const timeB = b.time ? b.time.split(':').join('') : '';

          return timeA.localeCompare(timeB);
        });
        setArticles(sortedArticles);
      })
      .catch(error => {
        console.error('There was an error fetching articles:', error);
      });

    const interval = setInterval(() => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
      setCurrentTime(formattedTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handlePurposeChange = event => {
    const value = event.target.value;

    if (value === 'Show All') {
      setSelectedPurposes(['Show All']);
    } else {
      setSelectedPurposes(prev => prev.filter(item => item !== 'Show All').concat(value));
    }
  };

  return (
    <div>
      <Box display='flex' alignItems='center' sx={{ my: 2, ml: 2 }}>
        <Typography variant='body2' id='current-time' sx={{ alignSelf: 'flex-start', px: 2 }}>
          {currentTime}
        </Typography>
        <ToggleButtonGroup
          value={selectedPurposes}
          onChange={handlePurposeChange}
          aria-label='purpose'
          size='small'
          sx={{ ml: 4 }}>
          <ToggleButton value='Show All' aria-label='Show All'>
            Show All
          </ToggleButton>
          <ToggleButton value='Uoft OM Half-day' aria-label='Uoft OM Half-day'>
            Uoft OM Half-day
          </ToggleButton>
          <ToggleButton value='UofT Aerospace' aria-label='UofT Aerospace'>
            UofT Aerospace
          </ToggleButton>
          <ToggleButton value='UofT Im AHD' aria-label='UofT Im AHD'>
            UofT Im AHD
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box px={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            {articles.map((article, index) => {
              const date = new Date(article.made_on);
              const formattedDate = new Intl.DateTimeFormat('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              }).format(date);
              const formattedTime = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <Card key={index} style={{ marginBottom: '20px' }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={3}>
                        <Typography variant='body2' color='textSecondary'>
                          {formattedDate}
                        </Typography>
                        <Typography variant='caption' color='textSecondary'>
                          {formattedTime}
                        </Typography>
                      </Grid>
                      <Grid item xs={9}>
                        <Box sx={{ backgroundColor: '#f1f8ff', p: '0.5rem' }}>
                          <Typography variant='h7' sx={{ fontWeight: '700' }}>
                            {article.title}
                          </Typography>
                        </Box>
                        <CardActions>
                          <Button variant='contained' color='primary'>
                            {article.purpose}
                          </Button>
                          <Button variant='outlined' color='primary' href={article.event_link} target='_blank'>
                            Join Meeting
                          </Button>
                          {/* Add your third button here */}
                        </CardActions>
                        <Typography variant='caption' color='textSecondary' style={{ float: 'right' }}>
                          Created by {article.organizer.username}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              );
            })}
          </Grid>
          <Grid item xs={12} md={5}>
            <ArticleCalendar articles={articles} />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default ArticleList;
