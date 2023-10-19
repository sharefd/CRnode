import { makeAutoObservable } from 'mobx';

class UserStore {
  user = null;
  articles = [];
  submittedRequests = [];
  feedbacks = [];

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user) {
    this.user = user;
  }

  setArticles(articles) {
    this.articles = articles;
  }

  setSubmittedRequests(submittedRequests) {
    this.submittedRequests = submittedRequests;
  }

  setFeedbacks(feedbacks) {
    this.feedbacks = feedbacks;
  }
}

const userStore = new UserStore();
export default userStore;
