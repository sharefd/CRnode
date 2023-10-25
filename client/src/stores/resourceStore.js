// resourceStore.js
import { makeAutoObservable } from 'mobx';

class ResourceStore {
  permissions = [];
  requests = [];
  users = [];

  constructor() {
    makeAutoObservable(this);
  }

  setPermissions(permissions) {
    this.permissions = permissions;
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
