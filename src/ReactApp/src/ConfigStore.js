import { decorate } from "mobx";

class ConfigStoreWrapper {
  backendUrl =
    (process.env.REACT_APP_BACKEND_URL === undefined
      ? window.location.origin
      : process.env.REACT_APP_BACKEND_URL) + "/api/";
  backendUrlHost =
    process.env.REACT_APP_BACKEND_URL === undefined
      ? window.location.origin
      : process.env.REACT_APP_BACKEND_URL;
  backendHeaders = { mode: "no-cors" };

  getAppConfig() {
    return fetch("appConfig.json").then(r => r.json());
  }
}

const ConfigStore = decorate(ConfigStoreWrapper, {});

export default new ConfigStore();
