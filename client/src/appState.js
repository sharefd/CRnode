import { atom } from 'recoil';

export const userState = atom({
  key: 'userState',
  default: null
});

export const articlesState = atom({
  key: 'articlesState',
  default: []
});

export const pastArticlesState = atom({
  key: 'pastArticlesState',
  default: []
});

export const requestsState = atom({
  key: 'requestsState',
  default: []
});

export const feedbacksState = atom({
  key: 'feedbacksState',
  default: []
});
