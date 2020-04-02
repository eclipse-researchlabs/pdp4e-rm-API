import React from "react";
import { Menu, Icon } from "antd";
import { withTranslation } from "react-i18next";
import { NavLink, withRouter } from "react-router-dom";

class MainMenu extends React.Component {
  render() {
    const appConfig = JSON.parse(localStorage.getItem("appConfig"));
    const { location } = this.props;
    return (
      <Menu
        mode="horizontal"
        theme="light"
        className="ant-top-menu"
        selectedKeys={[location.pathname]}
      >
        {appConfig.router.menus.map(e => {
          return (
            <Menu.Item key={e.to}>
              <NavLink to={e.to}>
                <span className="ant-menu-top-title">
                  {e.title !== "" && this.props.t(e.title)}
                  {e.title === "" && <Icon type={e.icon} />}
                </span>
              </NavLink>
            </Menu.Item>
          );
        })}
      </Menu>
    );
  }
}

export default withTranslation()(withRouter(MainMenu));
