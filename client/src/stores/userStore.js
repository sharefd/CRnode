import { makeAutoObservable } from 'mobx';

class UserStore {
  user = null;
  articles = [];
  submittedRequests = [];
  feedbacks = [];
  purposes = [];
  canRead = [];
  canWrite = [];
  attended = [];

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user) {
    this.user = user;
  }

  setAttended(attended) {
    this.attended = attended;
  }

  setPurposes(purposes) {
    this.purposes = purposes;
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

  setCanRead(canRead) {
    this.canRead = canRead;
  }

  setCanWrite(canWrite) {
    this.canWrite = canWrite;
  }
}

const userStore = new UserStore();
export default userStore;
