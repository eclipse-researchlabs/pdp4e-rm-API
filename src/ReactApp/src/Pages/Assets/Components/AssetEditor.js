import React from "react";
import * as _ from "lodash";
import { Row, Col } from "antd";
import GGEditor, { withPropsAPI } from "gg-editor";
import FlowToolbar from "../../../components/Editor/FlowToolbar";
import FlowItemPanelArc from "../../../components/Editor/FlowItemsPanelArc";
import FlowDetailPanel from "../../../components/Editor/FlowDetailPanel";

import BackendService from "./../../../components/BackendService";
import KoniCustomNode from "../../../components/Editor/KoniCustomNode";
import EditorMinimap from "../../../components/Editor/EditorMinimap";
import KoniCustomNodeDfd from "../../../components/Editor/KoniCustomNodeDfd";
import AssetEditorWindow from './AssetEditorWindow'

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
    // console.log('newGraphData', newGraphData)
    this.state = {
      toolbarItems: props.toolbarItems,
      itemsPanel: props.itemsPanel,
      containerId: props.containerId,
      graphData: newGraphData
    };
  }

  createGroup(item) {
    this.assetsApi
      .post("groups", {
        containerRootId: this.props.containerId,
        name: `Group ${this.props.graphData.groups.length}`,
        assets: item
      })
      .then(result => {
        result.json().then(data => {
          this.props.loadData();
        })
      });
  }

  render() {
    return (
      <GGEditor
        onAfterCommandExecute={({ command }) => {
          if (!_.isUndefined(command.addGroupId)) {
            this.createGroup(command.selectedItems);
          }
        }}>
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
          <Col span={_.isEmpty(this.state.itemsPanel) ? 24 : 16} style={{ maxHeight: '100%' }}>
            <AssetEditorWindow {...this.state}></AssetEditorWindow>
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

export default withPropsAPI(AssetEditor);
