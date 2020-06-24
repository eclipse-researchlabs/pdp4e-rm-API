import React from "react";
import { withTranslation } from "react-i18next";
import { observer } from "mobx-react";
import "storm-react-diagrams/dist/style.min.css";
import { Card, Tabs, Icon, message } from "antd";
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

import Modeler from 'bpmn-js/lib/Modeler';
import gridModule from 'diagram-js/lib/features/grid-snapping/visuals';


class AssetsPage extends React.Component {
  graphqlApi = new BackendService("graphql");
  containerApi = new BackendService("containers");
  assetsApi = new BackendService("assets");
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
      isLoading: true,
    };
  }

  modeler;
  updateBpmnDebounceCheck;

  componentDidMount() {
    var hasBpmn = JSON.stringify(this.extractPage("assets")).includes('bpmn-editor');
    this.setState({ containerId: this.props.match.params.containerId, hasBpmn: hasBpmn }, () => {
      this.loadData();
    });

    this.updateBpmnDebounceCheck = _.debounce(() => this.saveBpmn(), 10000);
  }

  initializeBpmn = () => {
    if (this.state.hasBpmn === true) {
      this.modeler = new Modeler({ container: '#bpmn-editor', additionalModules: [gridModule] });

      if (_.isNull(this.state.bpmn)) this.modeler.createDiagram();
      else this.modeler.importXML(this.state.bpmn);

      this.modeler.on('element.changed', (event) => {
        console.log('event', event)

        event.preventDefault();
        event.stopPropagation();

        switch (event.element.type) {
          case "bpmn:StartEvent":
          case "bpmn:IntermediateThrowEvent":
          case "bpmn:EndEvent":
          case "bpmn:ExclusiveGateway":
          case "bpmn:Task":
          case "bpmn:SubProcess":
          case "bpmn:DataObjectReference":
          case "bpmn:DataStoreReference":
            console.log('element', this.modeler);
            // this.assetsApi.put(`bpmn`, { containerId: this.props.match.params.containerId, name: event.element.type.split(':')[1], type: event.element.type, id: event.element.id.includes('_') ? null : event.element.id }).then(r => r.text()).then(r => {
            var modeling = this.modeler.get('modeling');
            console.log('modeling', modeling)
            // modeling.updateProperties(event.element, {});
            //   console.log('added', r);
            // })
            // create or update asset
            break;
        }



        console.log('element.changed', event)
        this.updateBpmnDebounceCheck();
      });
    }
  }

  saveBpmn = () => {
    this.modeler.saveXML({ format: true }, (err, xml) => {
      this.containerApi.post(`bpmn`, { payload: xml, containerId: this.props.match.params.containerId }).then(() => {
        message.success("BPMN saved.");
      });
    });
  }

  loadData = () => {
    this.setState({ isLoading: true }, () => {
      this.graphqlApi
        .get(
          `?query={containers(where:{path:"RootId",comparison:"equal",value:"${this.state.containerId}"}){name,bpmn,assets{id,name,payload,group,evidences{id,name},vulnerabilities{id,name},risks{id,name,payload{stride,lindun},createdDateTime,treatments{id,type,description,createdDateTime}},treatments{id,type,description,name,createdDateTime}},edges{id,fromId,toId,payload},groups{id,name,group,payload,vulnerabilities{id,name},risks{id},treatments{id,type,description}}}}`
        )
        .then(results => {
          if (!_.isUndefined(results)) {
            var nodes = results.containers[0].assets;
            _.forEach(results.containers[0].groups, group => {
              nodes.push(group);
            });
            console.log('allnodes', nodes)
            console.log('results.containers[0].bpmn', results.containers[0].bpmn)
            this.setState({
              name: results.containers[0].name,
              nodes: nodes,
              bpmn: results.containers[0].bpmn,
              graphData: this.getNodesAndEdgesData(
                results.containers[0].assets,
                results.containers[0].edges,
                results.containers[0].groups
              ),
              isLoading: false
            }, () => {
              this.initializeBpmn();
            });
          } else {
            this.setState({
              name: results.containers[0].name,
              nodes: [],
              graphData: this.getNodesAndEdgesData([], [], []),
              isLoading: false
            }, () => {
              this.initializeBpmn();
            });
          }
        });
    });
  };

  parseGroup(group) {
    var payload = JSON.parse(group.payload);
    console.log('group payload', payload)
    return {
      id: group.id,
      label: group.name,
      // index: (payload || { Index: 0 }).Index,
      zIndex: (payload || { Index: 1 }).Index,
      isCollapsed: false,
      parent: group.group
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
      index: (payload.Index || index) + 100,
      parent: node.group,
      labelOffsetY: payload.LabelOffsetY,
      payload: payload
      // anchorPoints: 
    };
  }

  parseEdge(edge, index) {
    var payload = JSON.parse(edge.payload);
    return {
      source: edge.fromId,
      sourceAnchor: payload.Asset1Anchor,
      target: edge.toId,
      targetAnchor: payload.Asset2Anchor,
      payload: payload,
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
      if (node.payload === undefined || node.payload === "null" || !node.payload.includes('Shape')) {
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
        return <AssetList nodes={this.state.nodes} edges={this.state.graphData.edges} key="assetList" />;
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
      case "ggeditor-bpmn":
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
            key={`assetEditor_bpmn_${this.state.containerId}`}
            bpmn
          />
        );
      case "bpmn-editor":
        return (
          <div>
            <h4 style={{ textAlign: "center" }}>BPMN editor will auto save after 10 seconds of last modification.</h4>
            <div id="bpmn-editor" style={{ height: 800 }}></div>
          </div>
        );
      case "assetkanban":
        return (
          <AssetKanban
            columns={layout.columns}
            columnsOrder={layout.columnsOrder}
            assets={this.state.nodes}
            key="assetsKanban"
          />
        );
      case "riskkanban":
        return (
          <RiskKanban
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
