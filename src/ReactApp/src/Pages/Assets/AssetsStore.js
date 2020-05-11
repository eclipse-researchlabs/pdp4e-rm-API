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

  parseRawImportToJson(containerId, input) {
    try {
      localStorage.removeItem("nodes");
      localStorage.removeItem("edges");

      this.json = JSON.parse(this.rawImport.result);
      this.getNodesOutOfJson();
      this.getEdgesOutOfJson();

      var assetsPromises = [];

      _.forEach(JSON.parse(localStorage.getItem("nodes")), node => {
        assetsPromises.push(
          new Promise((resolve, reject) => {
            this.assetsApi
              .post("", { 
                name: node.name, 
                payloadData: { color: "#1890FF", shape: "flow-rect", size: "80*48", x: "243", y: "364" } ,
                containerRootId: containerId,
              })
              .then(r => r.json())
              .then(asset => {
                return resolve(asset);
              });
          })
        );
      });

      Promise.all(assetsPromises).then(nodes => {
        _.forEach(JSON.parse(localStorage.getItem("edges")), edge => {
          var sourceAsset = _.find(nodes, ["name", edge.from]);
          var targetAsset = _.find(nodes, ["name", edge.to]);

          this.assetsApi.post("edge", {
            Asset1Guid: sourceAsset.id,
            Asset1Anchor: Math.floor(Math.random() * 3),
            Asset2Guid: targetAsset.id,
            Asset2Anchor: Math.floor(Math.random() * 3)
          });
        });

        console.log(nodes);
      });

      localStorage.removeItem("nodes");
      localStorage.removeItem("edges");

      notification.success({
        message: "Import Successful",
        description: `Found ${this.nodes.length} components`
      });
      this.nodesAndEdgesRead = true;
    } catch (err) {
      console.log("error", err);
      notification["error"]({
        message: "Import invalid",
        description: err.toString()
      });
    }
  }

  getNodesOutOfJson() {
    this.nodes = [];
    if (_.isUndefined(this.json["dm"]["components"])) {
      notification["error"]({
        message: "Import invalid",
        description: "Components description is missing"
      });
    } else {
      _.forEach(this.json["dm"]["components"], (component, index) => {
        this.nodes.push({
          key: index,
          name: component["name"],
          analysis: {
            vulnerabilities: [],
            risks: [],
            treatments: []
          }
        });
      });

      localStorage.setItem("nodes", JSON.stringify(this.nodes));
    }
  }

  getEdgesOutOfJson() {
    this.edges = [];
    if (_.isUndefined(this.json["dm"]["links"])) {
      notification["error"]({
        message: "Import invalid",
        description: "Links description is missing"
      });
    } else {
      _.forEach(this.json["dm"]["links"], link => {
        this.edges.push({
          name: link["name"],
          from: link["src"],
          to: link["target"]
        });
      });

      localStorage.setItem("edges", JSON.stringify(this.edges));
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
