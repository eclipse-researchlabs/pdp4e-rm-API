import React from "react";
import { withTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { Card, Collapse } from "antd";
import * as _ from "lodash";
import VulnerabiltiesComponent from "../../components/VulnearabiltiesComponent";
import UnwantedIncidentsComponent from "../../components/UnwantedIncidentsComponent";
import RisksComponent from "../../components/RisksComponents";
import TreatmentsComponent from "../../components/TreatmentsComponent";

import BackendService from "./../../components/BackendService";

class AssetsAnalysisPage extends React.Component {
  graphqlApi = new BackendService("graphql");

  constructor() {
    super();
    this.state = {
      assetId: "",
      asset: null
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    this.graphqlApi
      .get(
        `?query={assets(ids: ["${this.props.match.params.componentId}"]){id,rootId,name,payload,
      vulnerabilities{id,rootId,name,description},
      risks{id,rootId,name,description,
        risks{id,rootId,name},
        vulnerabilities{id,rootId,name},
        treatments{id,rootId,type,description}
        payload{
          impact,
          impactText,
          owasp{name,value},
          likelihood,
          likelihoodText,
          stride,
          lindun}},
      treatments{id,rootId,type,description}}}`
      )
      .then(result => {
        console.log('r', result.assets);

        this.setState({ assetId: this.props.match.params.componentId, asset: _.head(result.assets) });
      });
  }

  renderAnalysisComponent(analysisDiemnsion, key, asset) {
    switch (analysisDiemnsion) {
      case "vulnerabilities":
      default:
        return <VulnerabiltiesComponent nodeKey={key} asset={asset} reloadData={() => this.loadData()} />;
      case "unwantedIncidents":
        return <UnwantedIncidentsComponent nodeKey={key} asset={asset} reloadData={() => this.loadData()} />;
      case "risks":
        return <RisksComponent nodeKey={key} asset={asset} reloadData={() => this.loadData()} />;
      case "treatments":
        return <TreatmentsComponent nodeKey={key} asset={asset} reloadData={() => this.loadData()} />;
    }
  }

  extractView(layout) {
    if (layout === undefined || layout === null) return;
    var layouts = [];
    _.forEach(Object.keys(layout), item => {
      layouts.push(this.extractElement(item, layout[item]));
    });
    return layouts;
  }

  extractElement(type, layout) {
    switch (type.toLowerCase()) {
      case "collapse":
        return (
          <Collapse bordered={false} accordion={true} defaultActiveKey={_.head(layout)}>
            {layout.map(analysisDiemnsion => (
              <Collapse.Panel header={this.props.t(`Assets.analysis.${analysisDiemnsion}.title`)} key={analysisDiemnsion}>
                {this.renderAnalysisComponent(analysisDiemnsion, this.state.assetId, this.state.asset)}
              </Collapse.Panel>
            ))}
          </Collapse>
        );
      default:
        return {};
    }
  }

  extractPage(page) {
    const appConfig = JSON.parse(localStorage.getItem("appConfig"));
    return appConfig.pages[page];
  }

  render() {
    const pageSettings = this.extractPage("assetsAnalytics");
    return (
      <Card>
        {this.state.asset !== null && (
          <div>
            <Card style={{ height: "100%" }}>
              <h2>
                {this.props.t(pageSettings.title)} {this.state.asset.name}
              </h2>
            </Card>

            <Card style={{ height: "100%" }}>{this.extractView(pageSettings.layout)}</Card>
          </div>
        )}
      </Card>
    );
  }
}

export default withTranslation()(observer(AssetsAnalysisPage));
