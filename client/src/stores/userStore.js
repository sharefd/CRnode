import { makeAutoObservable } from 'mobx';

class UserStore {
  user = null;
  articles = [];
  submittedRequests = [];
  feedbacks = [];
  permissions = [];
  canRead = [];
  canWrite = [];

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user) {
    this.user = user;
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

  setPermissions(permissions) {
    this.permissions = permissions;
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
