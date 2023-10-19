import axios from 'axios';

const isDevelopment = process.env.NODE_ENV === 'development';
const baseUrl = isDevelopment ? 'http://localhost:3001' : '';

export default function useFetch() {
  const wrapPromise = promise => {
    let status = 'pending';
    let result = '';
    let suspender = promise.then(
      res => {
        status = 'success';
        result = res;
      },
      err => {
        status = 'error';
        result = err;
      }
    );
    return {
      read() {
        if (status === 'pending') {
          throw suspender;
        } else if (status === 'error') {
          throw result;
        }
        return result;
      }
    };
  };

  const createResource = () => {
    const cache = {
      articles: null,
      requests: null,
      feedbacks: null,
      users: null
    };

    return {
      articles: {
        read() {
          if (cache.articles === null) {
            cache.articles = wrapPromise(fetchArticles());
          }

          return cache.articles.read();
        }
      },
      requests: {
        read() {
          if (cache.requests === null) {
            cache.requests = wrapPromise(fetchRequests());
          }
          return cache.requests.read();
        }
      },
      feedbacks: {
        read() {
          if (cache.feedbacks === null) {
            cache.feedbacks = wrapPromise(fetchFeedbacks());
          }
          return cache.feedbacks.read();
        }
      },
      users: {
        read() {
          if (cache.users === null) {
            cache.users = wrapPromise(fetchUsers());
          }
          return cache.users.read();
        }
      }
    };
  };

  async function fetchArticles() {
    let articles;
    await axios
      .get(`${baseUrl}/api/articles`)
      .then(response => (articles = response.data))
      .catch(error => console.log(error));

    return articles;
  }

  async function fetchRequests() {
    let requests;
    await axios
      .get(`${baseUrl}/api/requests`)
      .then(response => (requests = response.data))
      .catch(error => console.log(error));

    return requests;
  }

  async function fetchFeedbacks() {
    let feedbacks;
    await axios
      .get(`${baseUrl}/api/feedbacks`)
      .then(response => (feedbacks = response.data))
      .catch(error => console.log(error));

    return feedbacks;
  }

  async function fetchUsers() {
    let users;
    await axios
      .get(`${baseUrl}/api/users`)
      .then(response => (users = response.data))
      .catch(error => console.log(error));

    return users;
  }

  return {
    createResource,
    fetchArticles,
    fetchRequests,
    fetchFeedbacks,
    fetchUsers
  };
}
