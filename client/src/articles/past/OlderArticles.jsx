import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  Button,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TextField,
  Container,
  Grid,
  Modal,
  TablePagination
} from '@mui/material';
import { formatDate } from '../../utils/dates';
import { useRecoilState, useRecoilValue } from 'recoil';
import { feedbacksState, pastArticlesState, userState } from '../../appState';
import axios from 'axios';
import LoadingSpinner from '../../helpers/LoadingSpinner';
import { AddCircle, Edit } from '@mui/icons-material';

const OlderArticles = () => {
  const [articles, setArticles] = useRecoilState(pastArticlesState);
  const user = useRecoilValue(userState);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState('');
  const [currentArticle, setCurrentArticle] = useState(null);
  const [feedbacks, setFeedbacks] = useRecoilState(feedbacksState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsUserLoaded(true);
      axios
        .get(`http://localhost:3001/api/feedbacks/${user._id}`)
        .then(response => {
          setFeedbacks(response.data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('There was an error fetching feedbacks:', error);
          setIsLoading(false);
        });
    }
  }, [user]);

  useEffect(() => {
    if (articles.length > 0) return;
    axios
      .get('http://localhost:3001/api/articles')
      .then(response => {
        setArticles(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching articles:', error);
      });
  }, []);

  const handleToggleAttending = (articleId, isAttending) => {
    if (isUserLoaded) {
      axios
        .put('http://localhost:3001/api/users/toggle-attend', {
          userId: user._id,
          articleId,
          isAttending
        })
        .then(response => {
          console.log('Successfully updated attendance:', response.data);
        })
        .catch(error => {
          console.error('There was an error updating attendance:', error);
        });
    }
  };

  const handleFeedbackSubmit = () => {
    if (isUserLoaded && currentArticle) {
      axios
        .post('http://localhost:3001/api/feedbacks', {
          articleId: currentArticle._id,
          userId: user._id,
          feedback: currentFeedback
        })
        .then(response => {
          console.log('Feedback submitted:', response.data);
          handleClose();
        })
        .catch(error => {
          console.error('There was an error submitting the feedback:', error);
        });
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

  const getFeedback = articleId => {
    const feedbackObj = feedbacks.find(f => f.articleId._id === articleId);
    return feedbackObj ? feedbackObj.feedback : '';
  };

  return (
    <Container>
      {!isUserLoaded || isLoading ? (
        <LoadingSpinner />
      ) : (
        <Grid container justifyContent='center' sx={{ mt: 4 }}>
          <Grid item xs={12} md={10}>
            <Card>
              <CardHeader title='Older Articles' style={{ backgroundColor: 'white', color: 'black' }} />
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell onClick={() => sortTable(0)}>Article Title</TableCell>
                        <TableCell onClick={() => sortTable(1)}>Date</TableCell>
                        <TableCell>Attended</TableCell>
                        <TableCell>Feedback</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {articles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((article, index) => (
                        <TableRow key={index}>
                          <TableCell
                            style={{
                              maxWidth: '200px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                            {article.title}
                          </TableCell>

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
                                <IconButton onClick={() => handleOpen(article, '')} sx={{ fontSize: '12px' }}>
                                  <AddCircle sx={{ fontSize: '16px' }} />
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
                  count={articles.length}
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
      )}
    </Container>
  );
};

export default OlderArticles;
