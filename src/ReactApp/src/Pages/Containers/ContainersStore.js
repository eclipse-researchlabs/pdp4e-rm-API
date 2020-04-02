import BackendService from "./../../components/BackendService";

class ContainersStore {
  containersApi = new BackendService("containers");

  createNewContainer = name => {
    return this.containersApi.post(``, { name: name }).then(r => r.json());
  };
}

export default new ContainersStore();
