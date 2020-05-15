import React from "react";
import { withTranslation } from "react-i18next";
import { observer } from "mobx-react";
import "storm-react-diagrams/dist/style.min.css";
import { Card, Tabs, Icon } from "antd";
import "./AssetsPage.css";
import * as _ from "lodash";
import AssetsStore from "./AssetsStore";
import UserInfo from "./../../components/UserInfo";
import UploadFile from '../../components/UploadFile'

import BackendService from "../../components/BackendService";

import AssetList from "./Components/AssetList";
import AssetEditor from "./Components/AssetEditor";
import AssetKanban from "./Components/AssetKanban";
import RiskKanban from "./Components/RiskKanban";
import TreatmentStatusCards from "./Components/TreatmentStatusCards";
import GDPRAssessmnet from "./Components/GDPRAssessment";

class AssetsPage extends React.Component {
  graphqlApi = new BackendService("graphql");
  userInfo = new UserInfo();
  store = AssetsStore;

  constructor() {
    super();

    this.state = {
      name: "",
      nodes: [],
      groups: [],
      edges: [],
      graphData: null,
      isLoading: true
    };
  }

  componentDidMount() {
    this.setState({ containerId: this.props.match.params.containerId }, () => {
      this.loadData();
    });
  }

  loadData = () => {
    this.setState({ isLoading: true }, () => {
      this.graphqlApi
        .get(
          `?query={containers(where:{path:"RootId",comparison:"equal",value:"${this.state.containerId}"}){name,assets{id,name,payload,group,vulnerabilities{id,name},risks{id,name,treatments{id,type,description}},treatments{id,type,description,name}},edges{id,fromId,toId,payload},groups{id,name,vulnerabilities{id,name},risks{id},treatments{id,type,description}}}}`
        )
        .then(results => {
          if (!_.isUndefined(results)) {
            var nodes = results.containers[0].assets;
            _.forEach(results.containers[0].groups, group => {
              nodes.push(group);
            });
            this.setState({
              name: results.containers[0].name,
              nodes: nodes,
              graphData: this.getNodesAndEdgesData(
                results.containers[0].assets,
                results.containers[0].edges,
                results.containers[0].groups
              ),
              isLoading: false
            });
          } else {
            this.setState({
              name: results.containers[0].name,
              nodes: [],
              graphData: this.getNodesAndEdgesData([], [], []),
              isLoading: false
            });
          }
        });
    });
  };

  parseGroup(group) {
    return {
      id: group.id,
      label: group.name,
      index: 0,
      isCollapsed: false
    };
  }

  parseNode(node, index) {
    var payload = JSON.parse(node.payload);
    return {
      type: payload.Type,
      size: payload.Size,
      shape: payload.Shape,
      color: payload.Color,
      label: node.name,
      icon: payload.Icon,
      src: payload.Src,
      x: +payload.X,
      y: +payload.Y,
      id: node.id,
      index: index + 1,
      parent: node.group,
      labelOffsetY: payload.LabelOffsetY
    };
  }

  parseEdge(edge, index) {
    var payload = JSON.parse(edge.payload);
    return {
      source: edge.fromId,
      sourceAnchor: payload.Asset1Anchor,
      target: edge.toId,
      targetAnchor: payload.Asset2Anchor,
      shape: payload.Shape,
      id: edge.id,
      label: payload.Name,
      index: index + 1
    };
  }

  getNodesAndEdgesData = (nodes, edges, groups) => {
    let data = {
      nodes: [],
      edges: [],
      groups: []
    };

    _.forEach(groups, (group, index) => {
      data.groups.push(this.parseGroup(group));
    });

    _.forEach(nodes, (node, index) => {
      if (node.payload === undefined || node.payload === "null") {
        return true;
      }
      data.nodes.push(this.parseNode(node, index));
    });

    _.forEach(edges, (edge, index) => {
      data.edges.push(this.parseEdge(edge, index));
    });
    return data;
  };

  extractView(layout) {
    var layouts = [];
    _.forEach(Object.keys(layout), item => {
      layouts.push(this.extractElement(item, layout[item]));
    });
    return layouts;
  }

  extractElement(type, layout) {
    if (!_.isUndefined(layout.accessRightRequired))
      if (!this.userInfo.hasAccess(layout.accessRightRequired))
        return <React.Fragment></React.Fragment>;

    switch (type.toLowerCase()) {
      case "tabs":
        return (
          <Tabs type="line" key="allTabs">
            {layout.map(tabData => {
              if (!_.isUndefined(tabData.accessRightRequired))
                if (!this.userInfo.hasAccess(tabData.accessRightRequired))
                  return (<div></div>);

              return (
                <Tabs.TabPane
                  tab={
                    <span>
                      <Icon type={tabData.icon} /> {this.props.t(tabData.title)}
                    </span>
                  }
                  key={tabData.key}
                >
                  {this.extractView(layout[layout.indexOf(tabData)].components)}
                </Tabs.TabPane>
              );
            })}
          </Tabs>
        );
      case "uploadgenesis":
        return <UploadFile containerId={this.props.containerId}></UploadFile>;
      case "assetlist":
        return <AssetList nodes={this.state.nodes} key="assetList" />;
      case "ggeditor":
        return (
          <AssetEditor
            containerId={this.state.containerId}
            itemsPanel={layout.itemPanels}
            toolbarItems={layout.toolbarItems}
            graphData={this.state.graphData}
            loadData={this.loadData}
            parseGroup={this.parseGroup}
            parseNode={this.parseNode}
            parseEdge={this.parseEdge}
            key={`assetEditor_${this.state.containerId}`}
          />
        );
      case "ggeditor-koni":
        return (
          <AssetEditor
            containerId={this.state.containerId}
            itemsPanel={layout.itemPanels}
            toolbarItems={layout.toolbarItems}
            graphData={this.state.graphData}
            loadData={this.loadData}
            parseGroup={this.parseGroup}
            parseNode={this.parseNode}
            parseEdge={this.parseEdge}
            key={`assetEditor_koni_${this.state.containerId}`}
            koni
          />
        );
      case "assetkanban":
        //console.log("kanbanData", this.state.kanbanData);
        return (
          <AssetKanban
            data={this.state.kanbanData}
            columns={layout.columns}
            columnsOrder={layout.columnsOrder}
            assets={this.state.nodes}
            key="assetsKanban"
          />
        );
      case "riskkanban":
        return (
          <RiskKanban
            data={this.state.kanbanData}
            columns={layout.columns}
            columnsOrder={layout.columnsOrder}
            assets={this.state.nodes}
            key="assetsKanban"
          />
        );
      case "treatmentdashboard":
        return (
          <TreatmentStatusCards
            data={this.state.nodes}
            key="treatmentDashboard"
          />
        );
      case "lindungdprprinciples":
        return {};
      case "lindungdprsubjectrights":
        return {};
      case "gdprassessment":
        return <GDPRAssessmnet />;
      default:
        return {};
    }
  }

  extractPage(page) {
    const appConfig = JSON.parse(localStorage.getItem("appConfig"));
    return appConfig.pages[page];
  }

  render() {
    const pageSettings = this.extractPage("assets");
    return (
      <React.Fragment>
        {this.state.isLoading === false && (
          <div>
            <Card style={{ height: "100%" }}>
              <h2>
                <small>{this.props.t(pageSettings.title)}:</small>{" "}
                {this.state.name}
              </h2>
            </Card>

            <Card style={{ height: "100%" }}>
              {this.extractView(pageSettings.layout)}
            </Card>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default withTranslation()(observer(AssetsPage));
