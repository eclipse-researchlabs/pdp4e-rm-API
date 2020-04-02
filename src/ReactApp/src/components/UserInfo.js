import React from "react";
import { Avatar, Icon, Badge, Dropdown, Menu, List } from "antd";
import { unregister } from "./../registerServiceWorker";
import BackendService from "./BackendService";
import * as _ from "lodash";
import { Link } from "react-router-dom";
//import Notifications from "./Notifications";

class UserInfo extends React.Component {
  graphqlApi = new BackendService("graphql");

  getInitials = username => {
    if (username === undefined || username === null) return "##";
    return username
      .split(" ")
      .map(word => word.substr(0, 1).toUpperCase())
      .join("");
  };

  getRandomCount() {
    return Math.floor(Math.random() * 20);
  }

  getRandomColor() {
    const colors = [
      "#ff790E",
      "#364E65",
      "#3796f6",
      "#EC547A",
      "#90A8BE",
      "#5BCEAE"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
 
  render() {
    const menu = (
      <Menu>
        <Menu.Item key="help">
          <a href="/help/index.html" target="_blank">
            <Icon type="question" style={{ marginRight: 10 }} />
            Help
          </a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <a href onClick={() => this.logout()}>
            <Icon type="logout" style={{ color: "red", marginRight: 10 }} />
            Logout
          </a>
        </Menu.Item>
      </Menu>
    );

    return (
      <div style={{ ...this.props.style }}>
        <Menu mode="horizontal" style={{ lineHeight: "62px" }}>
          <Menu.Item>
            <Dropdown overlay={menu} placement="bottomRight">
              <div>
                <Avatar
                  style={{
                    backgroundColor: this.getRandomColor(),
                    marginRight: 10
                  }}
                >
                  {this.getInitials(this.props.user.name)}
                </Avatar>
                {this.props.user.name}
              </div>
            </Dropdown>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

export default UserInfo;
