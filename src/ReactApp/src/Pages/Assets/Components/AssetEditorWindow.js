import React from "react";
import { withPropsAPI, Koni, Flow } from "gg-editor";
import BackendService from "./../../../components/BackendService";

class AssetEditorWindow extends React.Component {
  assetsApi = new BackendService("assets");

  deleteNode(id) { this.assetsApi.delete(`${id}`); }
  createNode(item, model) {
    this.assetsApi
      .post("", {
        name: `${model.label} ${this.props.graphData.nodes.length}`,
        containerRootId: this.props.containerId,
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
        const { getSelected, executeCommand, update } = this.props.propsAPI;
        const itemSelected = getSelected()[0];
        result.json().then(data => {
          executeCommand(() => {
            update(itemSelected, { id: data.id });
          });
        })
      });
  }
  moveNode(id, model) {
    if (model.x === undefined || model.y === undefined) return;

    this.assetsApi
      .put("position", {
        containerId: this.props.containerId,
        assetId: id,
        x: `${model.x}`,
        y: `${model.y}`
      });
  }
  linkNode(item, model) {
    this.assetsApi
      .post("link", {
        containerId: this.props.containerId,
        assetId: model.id,
        x: `${model.x}`,
        y: `${model.y}`,
      })
      .then(result => {
        const { getSelected, executeCommand, update } = this.props.propsAPI;
        const itemSelected = getSelected()[0];
        executeCommand(() => {
          update(itemSelected, { id: model.id });
        });
      });
  }

  deleteEdge(id) { this.assetsApi.delete(`edges/${id}`); }
  createEdge(item) {
    if (item.item.dataMap[item.model.source] === undefined || item.item.dataMap[item.model.target] === undefined) return;

    this.assetsApi
      .post("edges", {
        name: `Unknown`,
        containerRootId: this.props.containerId,
        Asset1Guid: item.item.dataMap[item.model.source].id,
        Asset1Anchor: item.model.sourceAnchor,
        Asset2Guid: item.item.dataMap[item.model.target].id,
        Asset2Anchor: item.model.targetAnchor
      })
      .then(result => {
        const { executeCommand, find, update } = this.props.propsAPI;
        result.json().then(data => {
          executeCommand(() => {
            update(find(item.item.id), { id: data.id, label: `Unknown` });
          });
        })
      });
  }

  deleteGroup(id) { this.assetsApi.delete(`groups/${id}`); }

  render() {
    console.log('windowProps', this.props)
    return (
      <div>
        {!this.props.koni && (
          <Flow
            onAfterChange={(e) => {
              console.log('flow', e)
              switch (e.action) {
                case "remove":
                  if (e.item.type === "node") this.deleteNode(e.item.id)
                  else if (e.item.type === "edge") this.deleteEdge(e.item.id);
                  else if (e.item.type === "group") this.deleteGroup(e.item.id);
                  break;
                case "add":
                  if (e.item.type === "node") {
                    console.log('e', e)
                    if (e.model.isDefined === undefined) this.createNode(e, e.model);
                    else if (e.model.isDefined === true) this.linkNode(e, e.model);
                  }
                  else if (e.item.type === "edge") this.createEdge(e);
                  else if (e.item.type === "group") return;
                  break;
                case "update":
                  if (e.item.type === "node" && e.updateModel["x"] !== null && e.updateModel["y"] !== null) this.moveNode(e.item.model.id, e.updateModel)
                  break;
              }
            }}
            data={this.props.graphData}
            style={{ height: 1000 }}
            grid={{ cell: 25 }}
            align={{ grid: "tl" }}
          />
        )}
        {this.props.koni && (
          <Koni
            onAfterChange={(e) => {
              console.log('oni', e)
              switch (e.action) {
                case "remove":
                  if (e.item.type === "node") this.deleteNode(e.item.id)
                  else if (e.item.type === "edge") this.deleteEdge(e.item.id);
                  else if (e.item.type === "group") this.deleteGroup(e.item.id);
                  break;
                case "add":
                  console.log('add', e)
                  if (e.item.type === "node") this.createNode(e.model)
                  else if (e.item.type === "edge") this.createEdge(e);
                  else if (e.item.type === "group") return;
                  break;
                case "update":
                  if (e.item.type === "node" && e.updateModel["x"] !== null && e.updateModel["y"] !== null) this.moveNode(e.item.id, e.updateModel)
                  break;
              }
            }}
            data={this.props.graphData}
            style={{ height: 1000 }}
            grid={{ cell: 25 }}
            align={{ grid: "tl" }}
          />
        )}
      </div>
    );
  }
}

export default withPropsAPI(AssetEditorWindow);
