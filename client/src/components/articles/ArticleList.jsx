import MACIMAHD1Icon from '@/assets/images/mcm.png';
import MACIMAHD2Icon from '@/assets/images/mcm2.png';
import MACIMAHD3Icon from '@/assets/images/mcm3.png';
import OM1Icon from '@/assets/images/om1.png';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAllowedArticles } from '@/hooks/useAllowedArticles';
import { deleteArticle, sortArticles, updateArticle } from '@/services/articles';
import userStore from '@/stores/userStore';
import { PURPOSE_CHOICES } from '@/utils/constants';
import { formatDateToReadable } from '@/utils/dates';
import { Edit } from '@mui/icons-material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { Box, Card, CardActions, CardContent, Divider, Grid, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import { useState } from 'react';
import { useMutation } from 'react-query';
import ActionBar from './actions/ActionBar';
import EditArticleModal from './actions/EditArticleModal';
import NewArticle from './actions/NewArticle';
import ArticleCalendar from './calendar/ArticleCalendar';

const purposeIcons = {
  OM1: <img src={OM1Icon} style={{ width: '18px', marginRight: '6px' }} />,
  UOFTAMR: <RocketLaunchIcon sx={{ width: '18px', marginRight: '6px', height: '18px' }} />,
  MACIMAHD1: <img src={MACIMAHD1Icon} style={{ width: '18px', marginRight: '6px' }} />,
  MACIMAHD2: <img src={MACIMAHD2Icon} style={{ width: '18px', marginRight: '6px' }} />,
  MACIMAHD3: <img src={MACIMAHD3Icon} style={{ width: '18px', marginRight: '6px' }} />

  // Add other purpose choices and their icons here
};

const ArticleList = observer(() => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showDetails, setShowDetails] = useState({});
  const [selectedPurposes, setSelectedPurposes] = useState(['Show All']);
  const [isExpanded, setIsExpanded] = useState(false);
  const [openNewArticleModal, setOpenNewArticleModal] = useState(false);

  const user = userStore.user;

  const { allowedArticles, permissions, isLoading, refetch } = useAllowedArticles();
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
                <Card key={index} variant='outlined' sx={{ marginBottom: '20px', position: 'relative' }}>
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
                          <button className='join-button'>Join Meeting</button>
                          <button
                            className={`info-button ${showDetails[article._id] ? 'active' : ''}`}
                            onClick={() => toggleDetails(article._id)}>
                            More Info
                          </button>
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
                            {purposeIcons[article.purpose]}
                            <span style={{ fontSize: '13px' }}>{PURPOSE_CHOICES[article.purpose]}</span>
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
            <ArticleCalendar articles={sortedArticles} />
          </Grid>
        </Grid>
      </Box>
      <NewArticle
        open={openNewArticleModal}
        onClose={toggleNewArticleModal}
        permissions={permissions}
        refetch={refetch}
      />
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
