// resourceStore.js
import { makeAutoObservable } from 'mobx';
import useFetch from '@/hooks/useFetch';

const { createResource } = useFetch();
const resource = createResource();

class ResourceStore {
  resource = resource;

  constructor() {
    makeAutoObservable(this);
  }
}

const resourceStore = new ResourceStore();
export default resourceStore;
