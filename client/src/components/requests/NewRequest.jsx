import { Button, Grid, LinearProgress, MenuItem, Paper, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userStore from '@/stores/userStore';
import { YEAR_OF_STUDY_CHOICES } from '@/utils/constants';
import { CheckCircle } from '@mui/icons-material';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useMutation, useQuery } from 'react-query';
import { fetchRequests, createRequest } from '@/services/requests';
import useArticlePermissions from '@/hooks/useArticlePermissions';

const isDevelopment = process.env.NODE_ENV === 'development';
const baseUrl = isDevelopment ? 'http://localhost:3001' : '';

const NewRequest = observer(() => {
  const navigate = useNavigate();
  const [purpose, setPurpose] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = userStore.user;

  const { data: requests, isLoading: isQueryLoading, refetch } = useQuery('requests', fetchRequests);

  const { purposes, isLoading: isPurposesLoading, canReadPurposes, canWritePurposes } = useArticlePermissions();

  const handleFeedbackSubmit = async currentArticle => {
    try {
      const response = await axios.put(`${baseUrl}/feedbacks/updateOrCreate`, {
        articleId: currentArticle._id,
        userId: user._id,
        feedback: currentFeedback
      });

      const temp = userStore.feedbacks.filter(f => f._id !== response.data.feedback._id);
      userStore.setFeedbacks([...temp, response.data.feedback]);
      feedbackMutation.mutate(response.data.feedback);
      handleClose();
    } catch (error) {
      console.error('There was an error submitting the feedback:', error);
    }
  };

  const feedbackMutation = useMutation(handleFeedbackSubmit, {
    onSuccess: () => {
      refetch();
    }
  });

  const createRequestMutation = useMutation(createRequest, {
    onSuccess: data => {
      userStore.setSubmittedRequests([...userStore.submittedRequests, data.request]);
      // refetch();
      navigate('/requests/submitted');
    },
    onError: error => {
      console.error('There was an error creating the request:', error);
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  useEffect(() => {
    if (!user || isQueryLoading) return;
    setIsLoading(true);
    if (userStore.submittedRequests.length === 0) {
      const userRequests = requests.filter(request => request.user && request.user._id === user._id);
      userStore.setSubmittedRequests(userRequests);
    }

    setIsLoading(false);
  }, [user, isQueryLoading]);

  const handleFormSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = { purpose, year_of_study: yearOfStudy, message, user: user._id, email: user.email };
    createRequestMutation.mutate(data);
  };

  const isPurposeAllowed = purpose => {
    if (!user || isPurposesLoading) return false;
    return canReadPurposes.map(p => p.name).includes(purpose);
  };

  const isRequestPending = purpose => {
    if (!user || isPurposesLoading) return false;

    const request = userStore.submittedRequests.find(r => r.purpose === purpose);
    return request && request.status === 'Pending';
  };

  if (isLoading || isPurposesLoading) return <LoadingSpinner />;

  return (
    <Paper elevation={3} sx={{ width: '40%', margin: '0 auto', mt: 8 }}>
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
          Submit Request
        </Typography>
      </Grid>
      <form onSubmit={handleFormSubmit}>
        {isSubmitting ? (
          <LinearProgress />
        ) : (
          <Grid container spacing={3} sx={{ padding: 4 }}>
            <Grid item xs={8}>
              <TextField
                id='purpose'
                inputProps={{ id: 'purpose' }}
                select
                label='Calendar'
                required
                fullWidth
                value={purpose}
                onChange={e => setPurpose(e.target.value)}>
                {purposes.map((purpose, index) => (
                  <MenuItem
                    key={index}
                    value={purpose.description}
                    disabled={isPurposeAllowed(purpose.name) || isRequestPending(purpose.name)}>
                    {purpose.description}
                    {isPurposeAllowed(purpose.name) ? (
                      <CheckCircle style={{ color: 'green', marginLeft: '10px' }} />
                    ) : isRequestPending(purpose.name) ? (
                      <ErrorOutlineIcon style={{ color: 'goldenrod', marginLeft: '10px' }} />
                    ) : null}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField
                id='level'
                inputProps={{ id: 'level' }}
                fullWidth
                required
                select
                label='Level'
                variant='outlined'
                value={yearOfStudy}
                onChange={e => setYearOfStudy(e.target.value)}>
                {YEAR_OF_STUDY_CHOICES.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id='message'
                inputProps={{ id: 'message' }}
                fullWidth
                multiline
                rows={4}
                label='Message (optional)'
                variant='outlined'
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <Button type='submit' variant='contained' color='primary' style={{ marginBottom: '10px' }}>
                Submit
              </Button>
            </Grid>
          </Grid>
        )}
      </form>
    </Paper>
  );
});

export default NewRequest;
