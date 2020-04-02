import React from "react";
import { withTranslation } from "react-i18next";
import * as _ from "lodash";
import { Row, Col } from "antd";
import GGEditor, { Flow, Koni } from "gg-editor";
import FlowToolbar from "../../../components/Editor/FlowToolbar";
import FlowItemPanelArc from "../../../components/Editor/FlowItemsPanelArc";
import FlowDetailPanel from "../../../components/Editor/FlowDetailPanel";

import BackendService from "./../../../components/BackendService";
import KoniCustomNode from "../../../components/Editor/KoniCustomNode";
import EditorMinimap from "../../../components/Editor/EditorMinimap";
import KoniCustomNodeDfd from "../../../components/Editor/KoniCustomNodeDfd";

class AssetEditor extends React.Component {
  assetsApi = new BackendService("assets");

  constructor(props) {
    super(props);

    let newGraphData = {};
    if (!props.koni) {
      const nodesFiltered = props.graphData.nodes.filter(
        node => node.shape !== "koni-custom-node-dfd"
      );
      const edgesFiltered = props.graphData.edges.filter(
        edge => _.findIndex(nodesFiltered, { id: edge.source }) > -1
      );

      newGraphData = {
        ...props.graphData,
        nodes: nodesFiltered,
        edges: edgesFiltered
      };
    } else {
      const nodesFiltered = props.graphData.nodes.filter(
        node => node.shape === "koni-custom-node-dfd"
      );
      const edgesFiltered = props.graphData.edges.filter(
        edge => _.findIndex(nodesFiltered, { id: edge.source }) > -1
      );

      newGraphData = {
        ...props.graphData,
        nodes: nodesFiltered,
        edges: edgesFiltered
      };
    }
    this.state = {
      toolbarItems: props.toolbarItems,
      itemsPanel: props.itemsPanel,
      containerId: props.containerId,
      graphData: newGraphData
    };
  }

  saveNewAssetObject = (type, model) => {
    switch (type) {
      case "node":
        console.log("model", model);
        this.assetsApi
          .post("", {
            name: `${model.label} ${this.state.graphData.nodes.length}`,
            containerRootId: this.state.containerId,
            payloadData: {
              color: model.color,
              shape: model.shape,
              size: model.size,
              x: `${model.x}`,
              y: `${model.y}`,
              src: model.src,
              icon: model.icon,
              type: model.type,
              labelOffsetY: `${model.labelOffsetY}`
            }
          })
          .then(result => {
            this.props.loadData();
          });
        break;
      case "edge":
        this.assetsApi
          .post("edge", {
            containerRootId: this.state.containerId,
            Asset1Guid: model.source,
            Asset1Anchor: model.sourceAnchor,
            Asset2Guid: model.target,
            Asset2Anchor: model.targetAnchor
          })
          .then(result => {
            this.props.loadData();
          });
        break;
      case "addGroup":
        this.assetsApi
          .post("groups", {
            containerRootId: this.state.containerId,
            name: `Group ${this.state.graphData.groups.length}`,
            assets: model
          })
          .then(result => {
            this.props.loadData();
          });
        break;
      case "unGroup":
        this.assetsApi.delete(`groups/${model.join()}`).then(result => {
          this.props.loadData();
        });
        break;
      case "delete":
        this.assetsApi.delete(`${model.join()}`).then(result => {
          this.props.loadData();
        });
        break;
      default:
        break;
    }
  };

  render() {
    console.log("this.props.editor", this.props);
    return (
      <GGEditor
        onAfterCommandExecute={({ command }) => {
          // console.log("cmd", command);
          if (!_.isUndefined(command.addId)) {
            this.saveNewAssetObject(command.type, command.addModel);
          }
          if (!_.isUndefined(command.addGroupId)) {
            this.saveNewAssetObject(command.name, command.selectedItems);
          }
          if (command.command === "unGroup" || command.command === "delete") {
            this.saveNewAssetObject(command.name, command.selectedItems);
          }
        }}
      >
        <Row>
          <Col span={24}>
            <FlowToolbar items={this.state.toolbarItems} />
          </Col>
        </Row>
        <Row>
          {!_.isEmpty(this.state.itemsPanel) && (
            <Col span={4}>
              <FlowItemPanelArc items={this.state.itemsPanel} />
            </Col>
          )}
          <Col span={_.isEmpty(this.state.itemsPanel) ? 24 : 16}>
            {!this.props.koni && (
              <Flow
                onDrop={e => {
                  if (e.currentItem !== undefined && e.currentItem !== null) {
                    this.assetsApi
                      .put("position", {
                        assetId: e.currentItem.id,
                        x: `${e.x}`,
                        y: `${e.y}`
                      })
                      .then(result => {
                        this.props.loadData();
                        return true;
                      });
                  }
                }}
                data={this.state.graphData}
                style={{ height: 600 }}
                grid={{ cell: 25 }}
                align={{ grid: "tl" }}
              />
            )}
            {this.props.koni && (
              <Koni
                onDrop={e => {
                  if (e.currentItem !== undefined && e.currentItem !== null) {
                    this.assetsApi
                      .put("position", {
                        assetId: e.currentItem.id,
                        x: `${e.x}`,
                        y: `${e.y}`
                      })
                      .then(result => {
                        this.props.loadData();

                        return true;
                      });
                  }
                }}
                data={this.state.graphData}
                style={{ height: 600 }}
                grid={{ cell: 25 }}
                align={{ grid: "tl" }}
              />
            )}
          </Col>
          {!_.isEmpty(this.state.itemsPanel) && (
            <Col span={4}>
              <FlowDetailPanel />
              <EditorMinimap />
            </Col>
          )}
        </Row>
        <KoniCustomNode />
        <KoniCustomNodeDfd />
      </GGEditor>
    );
  }
}

export default withTranslation()(AssetEditor);
