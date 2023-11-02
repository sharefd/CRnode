import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { createFeedback, fetchUserFeedbacks } from '@/services/feedbacks';
import { toggleAttending } from '@/services/users';
import userStore from '@/stores/userStore';
import { formatDate } from '@/utils/dates';
import { AddCircle, Edit } from '@mui/icons-material';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Container,
  Grid,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField
} from '@mui/material';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { sortArticlesDescending } from '@/services/articles';
import useArticlePermissions from '@/hooks/useArticlePermissions';

const localUser = localStorage.getItem('CloudRoundsUser');
const user = JSON.parse(localUser);

const OlderArticles = observer(() => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState('');
  const [currentArticle, setCurrentArticle] = useState(null);

  const {
    data: feedbacks,
    isLoading: isFeedbacksQueryLoading,
    refetch: refetchFeedbacks
  } = useQuery(['feedbacks', user?._id], () => fetchUserFeedbacks(user?._id), {
    enabled: !!user
  });

  const { allowedArticles, canReadPurposes, isLoading: isPurposesLoading } = useArticlePermissions();

  const sortedArticles = sortArticlesDescending(allowedArticles);

  useEffect(() => {
    if (!user || isFeedbacksQueryLoading) return;
    userStore.setFeedbacks(feedbacks);
  }, [user, feedbacks]);

  const handleFeedbackSubmit = async currentArticle => {
    try {
      const newFeedback = await createFeedback(user._id, currentFeedback, currentArticle._id);
      feedbackMutation.mutate(newFeedback);
      handleClose();
    } catch (error) {
      console.error('There was an error submitting the feedback:', error);
    }
  };

  const feedbackMutation = useMutation(handleFeedbackSubmit, {
    onSuccess: () => {
      refetchFeedbacks();
    }
  });

  const getFeedback = articleId => {
    const feedbackObj = userStore.feedbacks.find(f => f.articleId && f.articleId._id === articleId);
    return feedbackObj ? feedbackObj.feedback : '';
  };

  const handleToggleAttending = async (articleId, isAttending) => {
    if (user) {
      try {
        await toggleAttending(user._id, articleId, isAttending);
        runInAction(() => {
          if (isAttending) {
            userStore.user.attended.push(articleId);
          } else {
            const index = userStore.user.attended.indexOf(articleId);
            if (index > -1) {
              userStore.user.attended.splice(index, 1);
            }
          }
        });
      } catch (error) {
        console.error('There was an error updating attendance:', error);
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpen = (article, feedback) => {
    setCurrentArticle(article);
    setCurrentFeedback(feedback || '');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (isPurposesLoading) return <LoadingSpinner />;

  return (
    <Container>
      <Grid container justifyContent='center' sx={{ mt: 4 }}>
        <Grid item xs={12} md={10}>
          <Card>
            <CardHeader title='Older Articles' style={{ backgroundColor: '#0066b2', color: 'white' }} />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Calendar </TableCell>
                      <TableCell>Article Title</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Attended</TableCell>
                      <TableCell>Feedback</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedArticles
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((article, index) => (
                        <TableRow key={index}>
                          <TableCell>{article.purpose}</TableCell>
                          <TableCell>{article.title}</TableCell>
                          <TableCell>{formatDate(article)}</TableCell>
                          <TableCell>
                            <Checkbox
                              id={`attended-${article._id}`}
                              name={`attended-${article._id}`}
                              checked={user && user.attended.includes(article._id)}
                              onChange={e => handleToggleAttending(article._id, e.target.checked)}
                            />
                          </TableCell>
                          <TableCell>
                            {(() => {
                              const feedback = getFeedback(article._id);
                              return feedback ? (
                                <div style={{ fontSize: '12px' }}>
                                  <span>{feedback}</span>
                                  <IconButton onClick={() => handleOpen(article, feedback)}>
                                    <Edit />
                                  </IconButton>
                                </div>
                              ) : (
                                <IconButton onClick={() => handleOpen(article, '')}>
                                  <AddCircle />
                                </IconButton>
                              );
                            })()}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component='div'
                count={sortedArticles.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </CardContent>
          </Card>
        </Grid>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='simple-modal-title'
          aria-describedby='simple-modal-description'>
          <div
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              position: 'absolute',
              width: 400,
              backgroundColor: 'white',
              padding: '16px 32px 24px',
              outline: 'none'
            }}>
            <h2 id='simple-modal-title'>Feedback</h2>
            <h5 style={{ fontStyle: 'italic' }}>{currentArticle ? currentArticle.title : ''}</h5>
            <TextField
              id='feedback-edit'
              label='Your Feedback'
              variant='outlined'
              fullWidth
              value={currentFeedback}
              onChange={e => setCurrentFeedback(e.target.value)}
            />
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Button variant='contained' color='primary' onClick={() => handleFeedbackSubmit(currentArticle)}>
                Submit
              </Button>
            </div>
          </div>
        </Modal>
      </Grid>
    </Container>
  );
});

export default OlderArticles;
