import LoadingSpinner from '@/helpers/LoadingSpinner';
import { useAllowedArticles } from '@/hooks/useAllowedArticles';
import { deleteArticle, fetchArticles, sortArticles, updateArticle } from '@/services/articles';
import userStore from '@/stores/userStore';
import { PURPOSE_CHOICES } from '@/utils/constants';
import { formatDateToReadable } from '@/utils/dates';
import { BorderColorOutlined } from '@mui/icons-material';
import EngineeringIcon from '@mui/icons-material/Engineering';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { Box, Button, Card, CardActions, CardContent, Divider, Grid, IconButton, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import './ArticleList.css';
import ActionBar from './actions/ActionBar';
import EditArticleModal from './actions/EditArticleModal';
import NewArticle from './actions/NewArticle';
import ArticleCalendar from './calendar/ArticleCalendar';

const purposeIcons = {
  OM1: <EngineeringIcon />,
  UOFTAMR: <RocketLaunchIcon />
  // Add other purpose choices and their icons here
};

const ArticleList = observer(() => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showDetails, setShowDetails] = useState({});
  const [selectedPurposes, setSelectedPurposes] = useState(['Show All']);
  const [isExpanded, setIsExpanded] = useState(false);
  const [openNewArticleModal, setOpenNewArticleModal] = useState(false);

  const user = userStore.user;

  const {
    data: articles,
    isLoading: isQueryLoading,
    refetch
  } = useQuery(['articles', { type: 'list' }], fetchArticles);

  const { allowedArticles, permissions, isLoading } = useAllowedArticles(articles);
  const sortedArticles = sortArticles(allowedArticles);

  const deleteMutation = useMutation(deleteArticle, {
    onSuccess: (data, variables) => {
      refetch();
    }
  });

  const updateMutation = useMutation(updateArticle, {
    onSuccess: () => {
      refetch();
    }
  });

  const handleDelete = async articleId => {
    const isConfirmed = window.confirm('Are you sure you want to delete this article?');
    if (!isConfirmed) return;

    deleteArticle(articleId);
    setSelectedArticle(null);
    deleteMutation.mutate(articleId);
  };

  const handleSave = async editedArticle => {
    await updateArticle(editedArticle);
    setSelectedArticle(null);
    updateMutation.mutate(editedArticle);
  };

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

    setIsExpanded(prevState => ({
      ...prevState,
      [articleId]: !prevState[articleId]
    }));
  };

  const toggleNewArticleModal = () => {
    setOpenNewArticleModal(!openNewArticleModal);
  };

  const currentDate = new Date();
  const eightHoursAgo = new Date(currentDate);
  eightHoursAgo.setHours(eightHoursAgo.getHours() - 28);

  const isArticleAfterCurrentDate = article => {
    const articleDate = new Date(article.dateString);
    return articleDate >= eightHoursAgo;
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const filteredArticles = selectedPurposes.includes('Show All')
    ? sortedArticles.filter(isArticleAfterCurrentDate)
    : sortedArticles
        .filter(article => selectedPurposes.includes(PURPOSE_CHOICES[article.purpose]))
        .filter(isArticleAfterCurrentDate);

  return (
    <div>
      <ActionBar
        user={user}
        selectedPurposes={selectedPurposes}
        handlePurposeChange={handlePurposeChange}
        toggleNewArticleModal={toggleNewArticleModal}
      />
      <Box px={2}>
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
                            {purposeIcons[article.purpose]}
                            {PURPOSE_CHOICES[article.purpose]}
                          </Button>
                          <Button
                            variant='contained'
                            color='primary'
                            href={article.event_link}
                            target='_blank'
                            size='small'
                            sx={{ mx: 1, textTransform: 'none', textAlign: 'center' }}>
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
                              borderColor: 'white',
                              '&:hover': { backgroundColor: '#ececec', borderColor: 'gray' }
                            }}>
                            {isExpanded[article._id] ? 'Collapse' : 'Expand'} {'\u00A0'} <OpenInFullIcon />
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
                          <Divider orientation='vertical' flexItem sx={{ height: 24, mx: 1 }} />{' '}
                          <span> Speaker: {article.speaker || ''}</span>
                        </Box>

                        <Box
                          sx={{
                            display: showDetails[article._id] ? 'flex' : 'none',
                            alignItems: 'center',
                            mx: 2,
                            my: 1,
                            fontSize: '0.9rem'
                          }}>
                          <span> {article.additional_details || ''}</span>
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
          <Grid item xs={6} md={5} style={{ position: 'relative', marginTop: '-20px' }}>
            <ArticleCalendar articles={sortedArticles} />
          </Grid>
        </Grid>
      </Box>
      <NewArticle open={openNewArticleModal} onClose={toggleNewArticleModal} permissions={permissions} />
      <EditArticleModal
        open={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        article={selectedArticle}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
});

export default ArticleList;
