import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Box, CardContent, CardActions, Button, Grid, Typography, Divider, IconButton } from '@mui/material';
import ArticleCalendar from './calendar/ArticleCalendar';
import { compareDates, formatDateToReadable } from '../utils/dates';
import { ArticleFilters } from './ArticleFilters';
import { PURPOSE_CHOICES, PURPOSE_MAPPINGS } from '../utils/constants';
import './ArticleList.css';
import { useRecoilState, useRecoilValue } from 'recoil';
import { articlesState, userState } from '../appState';
import LoadingSpinner from '../helpers/LoadingSpinner';
import EngineeringIcon from '@mui/icons-material/Engineering';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import EditArticleModal from './EditArticleModal';
import EditIcon from '@mui/icons-material/Edit';
import { BorderColorOutlined } from '@mui/icons-material';

const purposeIcons = {
  OM1: <EngineeringIcon />,
  UOFTAMR: <RocketLaunchIcon />
  // Add other purpose choices and their icons here
};

const ArticleList = () => {
  const [articles, setArticles] = useRecoilState(articlesState);
  const [selectedArticle, setSelectedArticle] = useState(null); // for editing
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

  const handleSave = async editedArticle => {
    try {
      const response = await axios.put(`http://localhost:3001/api/articles/${editedArticle._id}`, editedArticle);
      const updatedArticle = response.data;

      const updatedArticles = articles.map(article => (article._id === updatedArticle._id ? updatedArticle : article));
      setArticles(updatedArticles);

      setSelectedArticle(null);
    } catch (error) {
      console.error('Error updating article:', error);
    }
  };

  const handleDelete = async articleId => {
    const isConfirmed = window.confirm('Are you sure you want to delete this article?');
    if (!isConfirmed) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3001/api/articles/${articleId}`);

      const remainingArticles = articles.filter(article => article._id !== articleId);
      setArticles(remainingArticles);

      setSelectedArticle(null);
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  useEffect(() => {
    if (articles.length > 0) return;
    if (isUserLoaded) {
      setIsLoading(true);
      axios
        .get('http://localhost:3001/api/articles')
        .then(response => {
          let permittedArticles;
          permittedArticles = response.data;
          permittedArticles = response.data.filter(article => {
            return user.permissions.some(permission => permission.purpose === article.purpose && permission.canRead);
          });

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
  eightHoursAgo.setHours(eightHoursAgo.getHours() - 28);

  const isArticleAfterCurrentDate = article => {
    const articleDate = new Date(article.dateString);
    return articleDate >= eightHoursAgo;
  };

  const filteredArticles = selectedPurposes.includes('Show All')
    ? articles.filter(isArticleAfterCurrentDate)
    : articles
        .filter(article => selectedPurposes.includes(PURPOSE_MAPPINGS[article.purpose]))
        .filter(isArticleAfterCurrentDate);

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
                return (
                  <Card key={index} variant='outlined' sx={{ marginBottom: '20px' }}>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={3}>
                          <Typography variant='body2' color='textSecondary'>
                            {formatDateToReadable(article.dateString)}
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

                          {article.organizer._id === user._id && (
                            <IconButton
                              onClick={() => setSelectedArticle(article)}
                              sx={{
                                float: 'right',
                                padding: '0px',
                                ml: 0.5,
                                '&:hover': {
                                  backgroundColor: 'transparent',
                                  color: 'blue'
                                }
                              }}>
                              <BorderColorOutlined sx={{ fontSize: '15px' }} />
                            </IconButton>
                          )}
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
            <Grid item xs={6} md={5} style={{ marginTop: '-35px' }}>
              <ArticleCalendar articles={articles} />
            </Grid>
          </Grid>
        </Box>
      )}
      <EditArticleModal
        open={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        article={selectedArticle}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ArticleList;
