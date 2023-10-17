import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Box, CardContent, CardActions, Button, Grid, Typography, Divider } from '@mui/material';
import ArticleCalendar from './calendar/ArticleCalendar';
import { compareDates, formatDate } from '../utils/dates';
import { ArticleFilters } from './ArticleFilters';
import { PURPOSE_CHOICES, PURPOSE_MAPPINGS } from '../utils/constants';
import './ArticleList.css';
import { useRecoilState, useRecoilValue } from 'recoil';
import { articlesState, userState } from '../appState';
import LoadingSpinner from '../helpers/LoadingSpinner';
import ConstructionIcon from '@mui/icons-material/Construction';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';


const purposeIcons = {
  'OM1': <ConstructionIcon />,
  'UOFTAMR': < RocketLaunchIcon />,
  // Add other purpose choices and their icons here
};


const ArticleList = () => {
  const [articles, setArticles] = useRecoilState(articlesState);
  const [showDetails, setShowDetails] = useState({});
  const [selectedPurposes, setSelectedPurposes] = useState(['Show All']);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const user = useRecoilValue(userState);

  useEffect(() => {
    if (user) {
      setIsUserLoaded(true);
    }
  }, [user]);

  useEffect(() => {
    if (articles.length > 0) return;
    if (isUserLoaded) {
      setIsLoading(true);
      axios
        .get('http://localhost:3001/api/articles')
        .then(response => {
          let permittedArticles;
          if (user.isAdmin) {
            permittedArticles = response.data;
          } else {
            permittedArticles = response.data.filter(article => user.permissions.includes(article.purpose));
          }

          const sortedArticles = permittedArticles.sort((a, b) => {
            return compareDates(a, b);
          });

          setArticles(sortedArticles);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('There was an error fetching articles:', error);
          setIsLoading(false);
        });
    }
  }, [isUserLoaded]);

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
  };

    const currentDate = new Date();
    const eightHoursAgo = new Date(currentDate);
    eightHoursAgo.setHours(eightHoursAgo.getHours() - 24);



    const filteredArticles = selectedPurposes.includes('Show All')
      ? articles.filter((article) => new Date(article.made_on) >= eightHoursAgo && currentDate)
      : articles.filter(
          (article) =>
            selectedPurposes.includes(PURPOSE_MAPPINGS[article.purpose]) &&
            new Date(article.made_on) >= currentDate
        );


  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Box px={2}>
          <ArticleFilters selectedPurposes={selectedPurposes} handlePurposeChange={handlePurposeChange} />
                  
                  
          <Grid container spacing={3}>
              
            <Grid item xs={12} md={7}>
              {filteredArticles.map((article, index) => {
                const formattedDate = formatDate(article);

                return (
                  <Card key={index} variant="outlined" elevation={1} 
                      
                      sx={{ marginBottom: '20px' 
                          
                          }}>

                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={3}>
                          <Typography variant='body2' color='textSecondary'>
                            {formattedDate}
                          </Typography>
                          <Typography variant='caption' color='textSecondary'>
                            {article.time}
                          </Typography>
                        </Grid>
                        <Grid item xs={9}>
                          <Box sx={{ backgroundColor: '#f1f8ff', p: '0.5rem' }}>
                            <Typography variant='h7' sx={{ fontWeight: '700' }}>
                              {article.title}
                            </Typography>
                          </Box>
                          <CardActions sx={{ my: 1 }}>
                            <Button
                              variant='outlined'
                              color='primary'
                              sx={{ my: 0.5, mx: 1, textTransform: 'none' }}
                              size='small'>
                                
                              {purposeIcons[article.purpose]} {/* Render the icon */}

                              {PURPOSE_CHOICES[article.purpose]}
                                
                            </Button>
                            <Button
                              variant='contained'
                              color='primary'
                              href={article.event_link}
                              target='_blank'
                              size='small'
                              sx={{ mx: 1, textTransform: 'none' }}>
                              Join Meeting
                            </Button>
                            <Button
                              variant='outlined'
                              onClick={() => toggleDetails(article._id)}
                              size='small'
                              sx={{
                                textTransform: 'none',
                                my: 0.5,
                                mx: 1,
                                color: 'gray',
                                borderColor: 'gray',
                                '&:hover': { backgroundColor: '#ececec', borderColor: 'gray' }
                              }}>
                              More Details
                            </Button>
                          </CardActions>
                          <Box
                            sx={{
                              display: showDetails[article._id] ? 'flex' : 'none',
                              alignItems: 'center',
                              mx: 2,
                              my: 1,
                              fontSize: '0.9rem'
                            }}>
                            <span>Meeting ID: {article.meeting_id || 'None'}</span>
                            <Divider orientation='vertical' flexItem sx={{ height: 24, mx: 1 }} />{' '}
                            <span>Passcode: {article.passcode || 'None'}</span>
                          </Box>

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
      )}
    </div>
  );
};

export default ArticleList;
