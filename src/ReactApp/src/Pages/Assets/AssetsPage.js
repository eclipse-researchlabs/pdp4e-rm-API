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
  allowUpdate = true;
  allowUpdateBpmnDebounceCheck;

  componentDidMount() {
    var hasBpmn = JSON.stringify(this.extractPage("assets")).includes('bpmn-editor');
    this.setState({ containerId: this.props.match.params.containerId, hasBpmn: hasBpmn }, () => {
      this.loadData();
    });

    this.updateBpmnDebounceCheck = _.debounce(() => this.saveBpmn(), 6000);
    this.allowUpdateBpmnDebounceCheck = _.debounce(() => this.allowUpdate = true, 500);
  }

  initializeBpmn = () => {
    if (this.state.hasBpmn === true) {
      this.modeler = new Modeler({ container: '#bpmn-editor', additionalModules: [gridModule] });

      if (_.isNull(this.state.bpmn)) this.modeler.createDiagram();
      else this.modeler.importXML(this.state.bpmn);

      var eventBus = this.modeler.get('eventBus');
      console.log('eventBus', eventBus)

      // console.log('eventBus', eventBus)
      var events = [
        'commandStack.label.create.postExecuted',
        'commandStack.connection.create.postExecuted',
        'commandStack.connection.delete.executed',
        'commandStack.shape.create.postExecuted', // created shape
        'commandStack.shape.delete.postExecuted', // removed shape
        'elements.changed',
      ];

      events.forEach((event) => {
        this.modeler.on(event, (e) => {
          if (this.allowUpdate === false) return;

          console.log('event', event, e)
          switch (event) {
            case "commandStack.label.create.postExecuted":
              setTimeout(() => {
                switch (this.getBpmnObjectType(e.context.labelTarget.type)) {
                  case "asset":
                    this.assetsApi.put(`name`, { assetId: e.context.labelTarget["businessObject"]["$attrs"]["assetId"], name: e.context.shape["businessObject"]["name"] });
                    break;
                  case "edge":
                    this.assetsApi.put(`edges/name`, { edgeId: e.context.labelTarget["businessObject"]["$attrs"]["assetId"], label: e.context.shape["businessObject"]["name"] });
                    break;
                  case "group":
                    this.assetsApi.put(`name`, { assetId: e.context.labelTarget["businessObject"]["$attrs"]["assetId"], name: e.context.shape["businessObject"]["categoryValueRef"]["value"] });
                    break;
                }
              }, 1000);
              break;
            case "commandStack.connection.create.postExecuted":
              this.assetsApi.put(`edges/bpmn`, {
                containerId: this.props.match.params.containerId, name: e.context.connection.type.split(':')[1], type: e.context.connection.type, id: e.context.connection["businessObject"]["$attrs"]["assetId"] === undefined ? null : e.context.connection["businessObject"]["$attrs"]["assetId"],
                editorId: e.context.connection.id, asset1Id: e.context.source["businessObject"]["$attrs"]["assetId"], asset2Id: e.context.target["businessObject"]["$attrs"]["assetId"]
              }).then(r => r.text()).then(r => {
                this.allowUpdate = false;
                this.allowUpdateBpmnDebounceCheck();

                var modeling = this.modeler.get('modeling');
                modeling.updateProperties(e.context.connection, { assetId: r.replace('"', '').replace('"', '') });
              });
              break;
            case "commandStack.connection.delete.executed":
              this.assetsApi.delete(`edges/${e.context.connection["businessObject"]["$attrs"]["assetId"]}`);
              break;
            case "commandStack.shape.create.postExecuted":
              switch (e.context.shape.type) {
                case "bpmn:EndEvent":
                case "bpmn:StartEvent":
                case "bpmn:IntermediateThrowEvent":
                case "bpmn:ExclusiveGateway":
                case "bpmn:Task":
                case "bpmn:SubProcess":
                case "bpmn:DataObjectReference":
                case "bpmn:DataStoreReference":
                  this.assetsApi.put(`bpmn`, { containerId: this.props.match.params.containerId, name: e.context.shape.type.split(':')[1], type: e.context.shape.type, id: e.context.shape["businessObject"]["$attrs"]["assetId"] === undefined ? null : e.context.shape["businessObject"]["$attrs"]["assetId"], editorId: e.context.shape.id }).then(r => r.text()).then(r => {
                    this.allowUpdate = false;
                    this.allowUpdateBpmnDebounceCheck();

                    var modeling = this.modeler.get('modeling');
                    modeling.updateProperties(e.context.shape, { assetId: r.replace('"', '').replace('"', '') });
                  });
                  break;
                case "bpmn:Participant":
                case "bpmn:Group":
                  this.assetsApi.put(`groups/bpmn`, { containerId: this.props.match.params.containerId, name: e.context.shape.type.split(':')[1], type: e.context.shape.type, id: e.context.shape["businessObject"]["$attrs"]["assetId"] === undefined ? null : e.context.shape["businessObject"]["$attrs"]["assetId"], editorId: e.context.shape.id }).then(r => r.text()).then(r => {
                    this.allowUpdate = false;
                    this.allowUpdateBpmnDebounceCheck();

                    var modeling = this.modeler.get('modeling');
                    modeling.updateProperties(e.context.shape, { assetId: r.replace('"', '').replace('"', '') });
                  });
                  break;
              }
              break;
            case "commandStack.shape.delete.postExecuted":
              this.assetsApi.delete(`${e.context.shape["businessObject"]["$attrs"]["assetId"]}`);
              break;
            case "elements.changed":
              _.forEach(e.elements, element => {
                // update group label
                var type = this.getBpmnObjectType(element.type);

                if (type === "group") {
                  if (element["businessObject"]["$attrs"]["assetId"] !== undefined && element["businessObject"]["name"] !== undefined) { // Update participant label
                    this.assetsApi.put(`name`, { assetId: element["businessObject"]["$attrs"]["assetId"], name: element["businessObject"]["name"] });
                  }
                  if (element["businessObject"]["$attrs"]["assetId"] !== undefined && element["businessObject"]["categoryValueRef"]["value"] !== undefined) { // Update group label
                    this.assetsApi.put(`name`, { assetId: element["businessObject"]["$attrs"]["assetId"], name: element["businessObject"]["categoryValueRef"]["value"] });
                  }
                }
                this.updateBpmnDebounceCheck();
              })
              break;
            default:
              console.log('event2', event, e)
              this.updateBpmnDebounceCheck();
              break;
          }
        });
      });
    }
  }

  getBpmnObjectType = (name) => {
    switch (name) {
      case "bpmn:EndEvent":
      case "bpmn:StartEvent":
      case "bpmn:IntermediateThrowEvent":
      case "bpmn:ExclusiveGateway":
      case "bpmn:Task":
      case "bpmn:SubProcess":
      case "bpmn:DataObjectReference":
      case "bpmn:DataStoreReference":
        return "asset";
      case "bpmn:Participant":
      case "bpmn:Group":
        return "group";
      case "bpmn:SequenceFlow":
        return "edge";
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
          `?query={containers(where:{path:"RootId",comparison:"equal",value:"${this.state.containerId}"}){name,assets{id,name,payload,group,evidences{id,name},vulnerabilities{id,name},risks{id,name,payload{stride,lindun},createdDateTime,treatments{id,type,description,createdDateTime}},treatments{id,type,description,name,createdDateTime}},edges{id,fromId,toId,payload},groups{id,name,group,payload,vulnerabilities{id,name},risks{id},treatments{id,type,description}}}}`
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
              bpmn: {}, //results.containers[0].bpmn,
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

  

  getNodesAndEdgesData = (nodes, edges, groups) => {

    let data = {
      nodes: [],
      edges: [],
      groups: []
    };

    _.forEach(groups, (group, index) => {
      data.groups.push(this.store.parseGroup(group));
    });

    _.forEach(nodes, (node, index) => {
      if (node.payload === undefined || node.payload === "null" || !node.payload.includes('Shape')) {
        return true;
      }
      data.nodes.push(this.store.parseNode(node, index));
    });

    _.forEach(edges, (edge, index) => {
      data.edges.push(this.store.parseEdge(edge, index));
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
        return <UploadFile containerId={this.state.containerId}></UploadFile>;
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
            <h4 style={{ textAlign: "center" }}>BPMN editor will auto save after 6 seconds of last modification.</h4>
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
        return <GDPRAssessmnet
          nodes={this.state.nodes}
        />;
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
