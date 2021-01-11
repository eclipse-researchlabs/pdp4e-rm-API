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

import React from "react";
import { Layout, Col, Row } from "antd";

//import MainMenu from './MainMenu';
import BaseLayoutStore from "./BaseLayoutStore";
import { observer } from "mobx-react";
import { withTranslation } from "react-i18next";
import MainMenu from "./MainMenu";

class BaseLayout extends React.Component {
  state = {
    collapsed: false
  };
  store = BaseLayoutStore;

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  cleanSession = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    const appConfig = JSON.parse(localStorage.getItem("appConfig"));
    return (
      <Layout>
        <Layout>
          <Layout.Header
            style={{
              position: "fixed",
              zIndex: 1,
              width: "100%",
              zIndex: 1001,
              boxShadow: "0px 0px 10px rgba(0,0,0,.06)"
            }}
          >
            <Row>
              <Col span={4}>
                <img
                  src={appConfig.header.path}
                  alt="Beawre"
                  style={{ height: "32px", marginTop: -5 }}
                />
              </Col>
              <Col span={16}>
                <MainMenu />
              </Col>
            </Row>
          </Layout.Header>
          <Layout.Content
            style={{ marginTop: "80px", marginLeft: 20, marginRight: 20 }}
          >
            {this.props.children}
          </Layout.Content>
          <Layout.Footer style={{ textAlign: "center" }}>
            <small>{appConfig.footer.text}</small>
          </Layout.Footer>
        </Layout>
      </Layout>
    );
  }
}

export default withTranslation()(observer(BaseLayout));
