import axios from 'axios';
import userStore from '@/stores/userStore';

const isDevelopment = process.env.NODE_ENV === 'development';
const baseUrl = isDevelopment ? 'http://localhost:3003' : '';

export const updateFeedback = async editedfeedback => {
  try {
    const response = await axios.put(`${baseUrl}/api/feedbacks/${editedfeedback._id}`, editedfeedback);
    const updatedfeedback = response.data;
    userStore.setFeedbacks(
      userStore.feedbacks.map(feedback => (feedback._id === updatedfeedback._id ? updatedfeedback : feedback))
    );
  } catch (error) {
    console.error('Error updating feedback:', error);
  }
};

export const createFeedback = async (userId, feedback, articleId) => {
  try {
    const response = await axios.post(`${baseUrl}/api/feedbacks`, {
      userId,
      feedback,
      articleId
    });
    return response.data.feedback;
  } catch (error) {
    console.error('There was an error creating the feedback:', error);
  }
};

export const deleteFeedback = async feedbackId => {
  try {
    await axios.delete(`${baseUrl}/api/feedbacks/${feedbackId}`);
    userStore.setFeedbacks(userStore.feedbacks.filter(feedback => feedback._id !== feedbackId));
  } catch (error) {
    console.error('Error deleting feedback:', error);
  }
};

export const fetchUserFeedbacks = async userId => {
  try {
    const response = await axios.get(`${baseUrl}/api/feedbacks/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user feedbacks:', error);
  }
};

export const fetchFeedbacks = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/feedbacks`);
    const feedbacks = response.data;
    userStore.setFeedbacks(feedbacks);
    return feedbacks;
  } catch (error) {
    console.error('Error fetching all feedbacks:', error);
  }
};
