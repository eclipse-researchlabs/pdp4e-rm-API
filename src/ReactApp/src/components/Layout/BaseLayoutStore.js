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
