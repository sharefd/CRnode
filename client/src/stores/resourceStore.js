// resourceStore.js
import { makeAutoObservable } from 'mobx';

class ResourceStore {
  purposes = [];
  requests = [];
  users = [];

  constructor() {
    makeAutoObservable(this);
  }

  setPurposes(purposes) {
    this.purposes = purposes;
  }

  setRequests(requests) {
    this.requests = requests;
  }

  setUsers(users) {
    this.users = users;
  }
}

const resourceStore = new ResourceStore();
export default resourceStore;
