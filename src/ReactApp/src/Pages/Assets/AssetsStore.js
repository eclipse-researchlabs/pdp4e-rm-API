import { observable, action, decorate } from "mobx";
import * as _ from "lodash";
import { notification } from "antd";
import BackendService from "./../../components/BackendService";

class AssetsStoreWrapper {
  rawImport = "";
  json = {};
  nodes = [];
  edges = [];
  nodesAndEdgesRead = false;

  assetsApi = new BackendService("assets");

  constructor() {
    this.nodes = JSON.parse(localStorage.getItem("nodes")) || [];
    this.edges = JSON.parse(localStorage.getItem("edges")) || [];
    if (!_.isEmpty(this.nodes)) {
      this.nodesAndEdgesRead = true;
    }
  }

  parseGroup(group) {
    var payload = JSON.parse(group.payload);
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

  parseRawImportToJson = (containerId, input) => {
    try {
      localStorage.removeItem("nodes");
      localStorage.removeItem("edges");

      this.json = JSON.parse(this.rawImport.result)["graph"];

      var nodes = [];
      var groups = [];
      var nodesCreatePromise = [];

      let i = 0;
      _.forEach(this.json["elements"]["nodes"], node => {
        var newNode = this.parseNode({ name: node.data.id, id: node.data.id, group: node.data.parent, payload: JSON.stringify({ Type: 'node', Size: '80*48', Color: "#1890FF", Shape: "flow-rect", X: node.position.x, Y: node.position.y }) }, i);
        nodes.push(newNode)
        i++;
      });

      var groupNames = nodes.map(x => x.parent).filter(x => x !== undefined);
      groups = nodes.filter(x => groupNames.includes(x.id));
      nodes = nodes.filter(x => !groupNames.includes(x.id));

      _.forEach(nodes, newNode => {
        nodesCreatePromise.push(new Promise((resolve) => {
          this.assetsApi
            .post("", {
              name: `${newNode.label} ${newNode.index}`,
              containerRootId: containerId,
              payloadData: {
                color: newNode.color,
                shape: newNode.shape,
                size: newNode.size,
                x: `${newNode.x}`,
                y: `${newNode.y}`,
                src: newNode.src,
                icon: newNode.icon,
                type: newNode.type,
                labelOffsetY: `48`
              }
            })
            .then(r => r.json())
            .then(r => {
              nodes.filter(x => x.id === newNode.id)[0].oldId = newNode.id;
              nodes.filter(x => x.id === newNode.id)[0].id = r['id'];
              return resolve(true);
            })
        }));
      })

      Promise.all(nodesCreatePromise).then(() => {

        var groupsCreatePromise = [];

        _.forEach(groups, group => {
          var nodesOfGroup = nodes.filter(x => x.parent === group.id).map(x => x.id);

          groupsCreatePromise.push(new Promise((resolve) => {
            this.assetsApi
              .post("groups", {
                name: `${group.label}`,
                containerRootId: containerId,
                assets: nodesOfGroup
              })
              .then(r => r.json())
              .then(r => {
                groups.filter(x => x.id === group.id)[0].oldId = group.id;
                groups.filter(x => x.id === group.id)[0].id = r['id'];
                return resolve(true);
              })
          }));
        })

        var edges = [];
        i = 0;
        _.forEach(this.json["elements"]["edges"], edge => {
          var newEdge = this.parseEdge({ id: edge.data.id, fromId: edge.data.source, toId: edge.data.target, payload: JSON.stringify({ Name: 'Unknown', Shape: null, Asset1Anchor: 1, Asset2Anchor: 1 }) }, i);
          edges.push(newEdge);

          groupsCreatePromise.push(new Promise((resolve) => {
            console.log('nodesedge', nodes, newEdge)

            var sourceNodeId = nodes.filter(x => x.oldId === newEdge.source)[0].id;
            var targetNodeId = nodes.filter(x => x.oldId === newEdge.target)[0].id;

            if (sourceNodeId === undefined || targetNodeId === undefined) return resolve();

            this.assetsApi
              .post("edges", {
                name: `Unknown`,
                containerRootId: containerId,
                Asset1Guid: sourceNodeId,
                Asset1Anchor: Math.floor(Math.random() * 3),
                Asset2Guid: targetNodeId,
                Asset2Anchor: Math.floor(Math.random() * 3)
              })
          }));
          i++;
        });

        Promise.all(groupsCreatePromise).then(() => {
          notification.success({
            message: "Import Successful",
            description: `Found ${nodes.length} components`
          });
          this.nodesAndEdgesRead = true;
        });
      });
    } catch (err) {
      console.log("error", err);
      notification["error"]({
        message: "Import invalid",
        description: err.toString()
      });
    }
  }

  addNewAnalysis(nodeId, analysisType, value) {
    console.log("new analytics", nodeId, analysisType, value);
    this.nodes[nodeId].analysis[analysisType].push(value);
    localStorage.setItem("nodes", JSON.stringify(this.nodes));
  }

  getTreatmentCount(nodeId) {
    return _(this.nodes[nodeId].analysis.risks)
      .map(risk => risk.treatments)
      .flatten()
      .value().length;
  }

  getTreatments(nodeId) {
    return _(this.nodes[nodeId].analysis.risks)
      .map(risk =>
        risk.treatments.map(treatment => {
          return { risk: risk.name, ...treatment };
        })
      )
      .flattenDepth(2)
      .value();
  }
}

const AssetsStore = decorate(AssetsStoreWrapper, {
  json: observable,
  nodes: observable,
  parseRawImportToJson: action,
  getEdgesOutOfJson: action,
  getNodesOutOfJson: action,
  nodesAndEdgesRead: observable,
  addNewAnalysis: action
});

export default new AssetsStore();
