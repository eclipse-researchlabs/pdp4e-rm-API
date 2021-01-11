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

import BackendService from "./../../components/BackendService";

class ContainersStore {
  containersApi = new BackendService("containers");

  createNewContainer = name => {
    return this.containersApi.post(``, { name: name }).then(r => r.json());
  };
}

export default new ContainersStore();
