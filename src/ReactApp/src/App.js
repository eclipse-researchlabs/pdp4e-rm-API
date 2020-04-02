import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import "antd/dist/antd.css";
import DocumentTitle from "react-document-title";
import { withTranslation } from "react-i18next";

import BaseLayout from "./components/Layout/BaseLayout";
import SettingsPage from "./Pages/SettingsPage";
import AssetsPage from "./Pages/Assets/AssetsPage";
import ContainersPage from "./Pages/Containers/ContainersPage";
import GDPRQuestionaire from "./Pages/GDPR/Questionaire/GDPRQuestionaire";
import AssetsAnalysisPage from "./Pages/AssetsAnalysis/AssetsAnalysisPage";

import ConfigStore from "./ConfigStore";
import UserInfo from "./components/UserInfo";

const AppRoute = ({
  component: Component,
  layout: Layout,
  title: Title,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => (
      <DocumentTitle title={Title}>
        <Layout pageTitle={Title}>
          <Component {...props} />
        </Layout>
      </DocumentTitle>
    )}
  />
);

class App extends Component {
  static displayName = App.name;
  userInfo = new UserInfo();

  constructor() {
    super();
    this.state = {
      isLoadingConfig: true
    };
  }

  componentDidMount() {
    ConfigStore.getAppConfig().then(r => {
      localStorage.setItem("appConfig", JSON.stringify(r));
        this.setState({ isLoadingConfig: false });
    });
  }

  render() {
    const appConfig = JSON.parse(localStorage.getItem("appConfig"));
    const componentsRegistry = {
      AssetsPage: AssetsPage,
      AssetsAnalysisPage: AssetsAnalysisPage,
      SettingsPage: SettingsPage,
      GDPRQuestionaire: GDPRQuestionaire,
      ContainersPage: ContainersPage
    };

    return (
      <div>
        {!this.state.isLoadingConfig && appConfig.router !== undefined && (
          <Switch>
            {appConfig.router.paths.map(e => (
              <AppRoute
                key={e.path}
                exact
                layout={BaseLayout}
                title={this.props.t(e.title)}
                path={e.path}
                component={componentsRegistry[e.component]}
              />
            ))}
            <Route
              exect
              path="/"
              render={() => <Redirect to={appConfig.router.defaultRoute} />}
            />
          </Switch>
        )}
      </div>
    );
  }
}

export default withTranslation()(App);
