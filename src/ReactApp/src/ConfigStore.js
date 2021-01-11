/* 
 *  Copyright (c) 2019,2021 Beawre Digital SL
 *  
 *  This program and the accompanying materials are made available under the
 *  terms of the Eclipse Public License 2.0 which is available at
 *  http://www.eclipse.org/legal/epl-2.0.
 *  
 *  SPDX-License-Identifier: EPL-2.0 3
 *  
 */

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
