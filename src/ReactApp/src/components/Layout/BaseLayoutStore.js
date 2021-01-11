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

import { observable, action, decorate } from "mobx";

class BaseLayoutWrapper {
  menuCollapsed = false;
  user = {};

  toggleMenuCollapsed() {
    this.menuCollapsed = !this.menuCollapsed;
  }

  constructor() {
  }
}

const BaseLayoutStore = decorate(BaseLayoutWrapper, {
  menuCollapsed: observable,
  toggleMenuCollapsed: action.bound
});

export default new BaseLayoutStore();
