import userStore from '@/stores/userStore';
import { compareDates } from '@/utils/dates';
import axios from 'axios';

const isDevelopment = process.env.NODE_ENV === 'development';
const baseUrl = isDevelopment ? 'http://localhost:3003' : '';

export const updateArticle = async editedArticle => {
  try {
    const response = await axios.put(`${baseUrl}/api/articles/${editedArticle._id}`, editedArticle);
    const updatedArticle = response.data;
    return updatedArticle;
  } catch (error) {
    console.error('Error updating article:', error);
  }
};

export const createArticle = async article => {
  try {
    const response = await axios.post(`${baseUrl}/api/articles/new`, article);
    console.log('Article created:', response.data);
    return response.data;
  } catch (error) {
    console.error('There was an error creating the article:', error);
  }
};

export const deleteArticle = async articleId => {
  try {
    await axios.delete(`${baseUrl}/api/articles/${articleId}`);
    userStore.setArticles(userStore.articles.filter(article => article._id !== articleId));
  } catch (error) {
    console.error('Error deleting article:', error);
  }
};

export const sortArticles = articles => {
  return articles.sort(compareDates);
};

export const sortArticlesDescending = articles => {
  return articles.sort((a, b) => {
    return compareDates(b, a);
  });
};

export const fetchArticles = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/articles`);
    const articles = response.data;
    userStore.setArticles(articles);
    return articles;
  } catch (error) {
    console.error('Error updating article:', error);
  }
};
