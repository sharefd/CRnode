import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { deleteArticle, sortArticles, updateArticle } from '@/services/articles';
import userStore from '@/stores/userStore';
import { formatDateToReadable } from '@/utils/dates';
import { Edit } from '@mui/icons-material';
import { Box, Button, Card, CardActions, CardContent, Divider, Grid, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import ActionBar from './actions/ActionBar';
import EditArticleModal from './actions/EditArticleModal';
import NewArticle from './actions/NewArticle';
import ArticleCalendar from './calendar/ArticleCalendar';
import { purposeIcons } from '@/components/ui/PurposeIcons';
import { formatDuration12Hour } from '@/utils/calendar';
import useArticlePermissions from '@/hooks/useArticlePermissions';

const ArticleList = observer(() => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showDetails, setShowDetails] = useState({});
  const [selectedPurposes, setSelectedPurposes] = useState(['Show All']);
  const [isExpanded, setIsExpanded] = useState(false);
  const [openNewArticleModal, setOpenNewArticleModal] = useState(false);
  const [localArticles, setLocalArticles] = useState([]);

  const user = userStore.user;

  const {
    allowedArticles,
    canWritePurposes,
    isLoading,
    refetchArticles,
    refetch: refetchPurposes
  } = useArticlePermissions();

  useEffect(() => {
    if (isLoading) return;

    const sortedArticles = sortArticles(allowedArticles);
    setLocalArticles(sortedArticles);
  }, [isLoading, allowedArticles]);

  const deleteMutation = useMutation(deleteArticle, {
    onSuccess: (data, variables) => {
      setLocalArticles(localArticles.filter(article => article._id !== variables));
      refetchArticles();
    }
  });

  const updateMutation = useMutation(updateArticle, {
    onSuccess: () => {
      refetchArticles();
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
    setLocalArticles(localArticles.map(article => (article._id === editedArticle._id ? editedArticle : article)));
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
    const articleDate = new Date(article ? article.dateString : '');
    return articleDate >= eightHoursAgo;
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const filteredArticles = selectedPurposes.includes('Show All')
    ? localArticles.filter(isArticleAfterCurrentDate)
    : localArticles.filter(article => selectedPurposes.includes(article.purpose)).filter(isArticleAfterCurrentDate);

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
                <Card key={index} variant='outlined' sx={{ marginBottom: '20px', position: 'relative' }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={3}>
                        <Typography variant='subtitle1' color='textSecondary'>
                          {formatDateToReadable(article.dateString)}
                        </Typography>

                        <Typography variant='caption' color='textSecondary'>
                          {formatDuration12Hour(article)}
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
                        {/* BEGINNING OF card footer */}
                        <Box sx={{ mt: 2 }}>
                          <Box className='purpose-badge'>
                            {purposeIcons[article.purpose] || purposeIcons.DEFAULT}
                            <span style={{ fontSize: '13px' }}>{article.purpose}</span>
                          </Box>
                          <button
                            className={`edit-article ${article.organizer._id === user._id ? 'creator' : ''}`}
                            onClick={() => setSelectedArticle(article)}
                            disabled={article.organizer._id !== user._id}>
                            Created by {article.organizer.username}
                            {article.organizer._id === user._id && <Edit sx={{ fontSize: '12px', ml: 0.5 }} />}
                          </button>
                          {/* END OF card footer*/}
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              );
            })}
          </Grid>
          <Grid item xs={6} md={5} style={{ position: 'relative', marginTop: '-20px' }}>
            <ArticleCalendar articles={localArticles} />
          </Grid>
        </Grid>
      </Box>
      <NewArticle
        open={openNewArticleModal}
        onClose={toggleNewArticleModal}
        setLocalArticles={setLocalArticles}
        canWritePurposes={canWritePurposes}
        refetch={refetchArticles}
        refetchPurposes={refetchPurposes}
      />
      <EditArticleModal
        open={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        allowedPurposes={canWritePurposes}
        article={selectedArticle}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
});

export default ArticleList;
