import ConfigStore from "../ConfigStore";
// import AuthService from "./Auth/AuthService";
import * as _ from "lodash";
import { unregister } from "./../registerServiceWorker";

export default class BackendService {
  basePath = "";
  accessToken = "";
  //   auth = new AuthService();
  config = ConfigStore;

  constructor(path) {
    this.basePath = this.config.backendUrl + path;

    this.accessToken = localStorage.getItem("userId");
  }

  getUrl(url) {
    return url === ""
      ? ""
      : url.toString().substring(0, 1) === "?"
        ? url
        : "/" + url;
  }

  get(url = "") {
    return fetch(this.basePath + this.getUrl(url), {
      headers: new Headers({
        // "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${this.accessToken}`
      })
    }).then(response => {
      if (response.status === 204) {
        return new Promise(function (resolve, reject) {
          resolve();
        });
      }
      return response.json();
    });
  }

  post(url = "", payload) {
    console.log("post-payload", payload);
    return fetch(this.basePath + this.getUrl(url), {
      headers: new Headers({
        "Content-Type": "application/json",
        // Accept: "application/json",
        Authorization: `Bearer ${this.accessToken}`
      }),
      method: "POST",
      body: JSON.stringify(payload)
    });
  }

  put(url = "", payload) {
    return fetch(this.basePath + this.getUrl(url), {
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${this.accessToken}`
      }),
      method: "PUT",
      body: JSON.stringify(payload)
    });
  }

  delete(url = "") {
    return fetch(this.basePath + this.getUrl(url), {
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${this.accessToken}`
      }),
      method: "DELETE"
    });
  }

  deserializePayload(objectArray) {
    objectArray.forEach((object, index) => {
      if (!_.isEmpty(object["payload"])) {
        object["payload"] = JSON.parse(object["payload"]);
        if (!object["payload"]["RiskStatus"]) object["payload"]["RiskStatus"] = ["-1"];
      }

      if (!_.isEmpty(object["children"])) {
        object["children"] = this.deserializePayload(object["children"]);
      }

      if (!_.isEmpty(object["documentsOfTask"])) {
        object["documentsOfTask"] = this.deserializePayload(object["documentsOfTask"]);
      }

      if (!_.isEmpty(object["containers"])) {
        object["containers"] = this.deserializePayload(object["containers"]);
      }
    });

    return objectArray;
  }
}
