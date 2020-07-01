import React, { Fragment } from "react";
import { Card, Form, Input, Select, message, Button, Modal } from "antd";
import DfdQuestionaire from './../../Pages/Assets/Components/DfdQuestionaire'
import { withPropsAPI } from "gg-editor";
import BackendService from "./../../components/BackendService";
import DfdStore from './../../Pages/Assets/Components/DfdStore';

const upperFirst = str => {
  return str.toLowerCase().replace(/( |^)[a-z]/g, l => l.toUpperCase());
};

const { Item } = Form;
const { Option } = Select;

const inlineFormItemLayout = {
  labelCol: {
    sm: { span: 8 }
  },
  wrapperCol: {
    sm: { span: 16 }
  }
};

class DetailForm extends React.Component {
  assetsApi = new BackendService("assets");
  dfdStore = DfdStore;

  get item() {
    const { propsAPI } = this.props;
    return propsAPI.getSelected()[0];
  }

  handleNameChangeSubmit = e => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    const { form, propsAPI } = this.props;
    const { getSelected, executeCommand, update } = propsAPI;

    setTimeout(() => {
      form.validateFieldsAndScroll((err, values) => {
        if (err) {
          return;
        }

        const item = getSelected()[0];

        if (!item) {
          return;
        }
        executeCommand(() => {
          update(item, {
            ...values
          });
        });

        switch (item.type) {
          case "group":
          case "node":
            this.assetsApi
              .put(`name`, {
                assetId: item.model.id,
                name: values.label
              })
              .then(r => {
                message.success("Name has been updated!");
              });
            break;
          case "edge":
            this.assetsApi
              .put(`edges/name`, {
                edgeId: item.model.id,
                label: item.model.label,
                shape: item.model.shape
              })
              .then(r => {
                message.success("Edge name has been updated!");
              });
            break;
          default:
            break;
        }
      });
    }, 0);
  };

  handleDfdTypeChangeSubmit = e => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    const { form, propsAPI } = this.props;
    const { getSelected, executeCommand, update } = propsAPI;

    setTimeout(() => {
      form.validateFieldsAndScroll((err, values) => {
        if (err) {
          return;
        }

        const item = getSelected()[0];
        console.log('update', item, values)

        if (!item) {
          return;
        }

        values["shape"] = `koni-custom-node-${values["entityType"]}-dfd`;
        switch (values["entityType"]) {
          case "entity":
            values["src"] = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAuMDAwMDAwMDAwMDAwMDEiIGhlaWdodD0iNjAuMDAwMDAwMDAwMDAwMDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+IDx0aXRsZS8+IDxkZXNjLz4gPGc+ICA8dGl0bGU+YmFja2dyb3VuZDwvdGl0bGU+ICA8cmVjdCBmaWxsPSJub25lIiBpZD0iY2FudmFzX2JhY2tncm91bmQiIGhlaWdodD0iNjIiIHdpZHRoPSI2MiIgeT0iLTEiIHg9Ii0xIi8+IDwvZz4gPGc+ICA8dGl0bGU+TGF5ZXIgMTwvdGl0bGU+ICA8ZWxsaXBzZSBzdHJva2U9Im51bGwiIHJ5PSIyOS42OTYyNDkiIHJ4PSIyOS42OTYyNDgiIGlkPSJzdmdfMSIgY3k9IjI5Ljk5OTk5OSIgY3g9IjMwIiBzdHJva2Utb3BhY2l0eT0ibnVsbCIgc3Ryb2tlLXdpZHRoPSJudWxsIiBmaWxsPSIjMTg5MGZmIi8+ICA8cmVjdCByeD0iMSIgc3Ryb2tlPSIjZmZmZmZmIiBpZD0ic3ZnXzIiIGhlaWdodD0iMjkuOTM2MjEiIHdpZHRoPSIzMC4wMTI3NzMiIHk9IjE1LjAzMTg5NSIgeD0iMTQuOTkzNjEzIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz4gIDxwYXRoIGlkPSJzdmdfMyIgZD0ibTcwLjk0OTYzMSwyMC41MDAxOTVsMi40MDM2MiwzLjQwODI4NWwwLjgxMzkwNiwtNy45MzU1ODEiIG9wYWNpdHk9IjAuNSIgc3Ryb2tlLXdpZHRoPSI2IiBzdHJva2U9IiNmZmZmZmYiIGZpbGw9Im5vbmUiLz4gPC9nPjwvc3ZnPg==";
            values["icon"] = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+IDx0aXRsZS8+IDxkZXNjLz4gPGc+ICA8dGl0bGU+YmFja2dyb3VuZDwvdGl0bGU+ICA8cmVjdCBmaWxsPSJub25lIiBpZD0iY2FudmFzX2JhY2tncm91bmQiIGhlaWdodD0iNDAyIiB3aWR0aD0iNTgyIiB5PSItMSIgeD0iLTEiLz4gPC9nPiA8Zz4gIDx0aXRsZT5MYXllciAxPC90aXRsZT4gIDxwYXRoIGZpbGw9IiNmZmZmZmYiIGlkPSJTaGFwZSIgZD0ibTE2LDJsMCwxNGwtMTQsMGwwLC0xNGwxNCwwbDAsMHptMCwtMmwtMTQsMGMtMS4xLDAgLTIsMC45IC0yLDJsMCwxNGMwLDEuMSAwLjksMiAyLDJsMTQsMGMxLjEsMCAyLC0wLjkgMiwtMmwwLC0xNGMwLC0xLjEgLTAuOSwtMiAtMiwtMmwwLDBsMCwweiIvPiA8L2c+PC9zdmc+";
            values["color"] = "#69C0FF";
            break;
          case "datastore":
            values["src"] = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAuMDAwMDAwMDAwMDAwMDEiIGhlaWdodD0iNjAuMDAwMDAwMDAwMDAwMDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+IDx0aXRsZS8+IDxkZXNjLz4gPGc+ICA8dGl0bGU+YmFja2dyb3VuZDwvdGl0bGU+ICA8cmVjdCBmaWxsPSJub25lIiBpZD0iY2FudmFzX2JhY2tncm91bmQiIGhlaWdodD0iNjIiIHdpZHRoPSI2MiIgeT0iLTEiIHg9Ii0xIi8+IDwvZz4gPGc+ICA8dGl0bGU+TGF5ZXIgMTwvdGl0bGU+ICA8ZWxsaXBzZSBzdHJva2U9Im51bGwiIHJ5PSIyOS42OTYyNDkiIHJ4PSIyOS42OTYyNDgiIGlkPSJzdmdfMSIgY3k9IjI5Ljk5OTk5OSIgY3g9IjMwIiBzdHJva2Utb3BhY2l0eT0ibnVsbCIgc3Ryb2tlLXdpZHRoPSJudWxsIiBmaWxsPSIjMTg5MGZmIi8+ICA8cGF0aCBpZD0ic3ZnXzMiIGQ9Im03MC45NDk2MzEsMjAuNTAwMTk1bDIuNDAzNjIsMy40MDgyODVsMC44MTM5MDYsLTcuOTM1NTgxIiBvcGFjaXR5PSIwLjUiIHN0cm9rZS13aWR0aD0iNiIgc3Ryb2tlPSIjZmZmZmZmIiBmaWxsPSJub25lIi8+ICA8bGluZSBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS1saW5lY2FwPSJudWxsIiBzdHJva2UtbGluZWpvaW49Im51bGwiIGlkPSJzdmdfNCIgeTI9IjIwLjcwMzY3MSIgeDI9IjQ2LjczNTkzNyIgeTE9IjIwLjcwMzY3MSIgeDE9IjEyLjg1NzExMiIgZmlsbC1vcGFjaXR5PSJudWxsIiBzdHJva2Utb3BhY2l0eT0ibnVsbCIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIi8+ICA8bGluZSBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS1saW5lY2FwPSJudWxsIiBzdHJva2UtbGluZWpvaW49Im51bGwiIGlkPSJzdmdfNSIgeTI9IjM5LjYyNjk3OSIgeDI9IjQ2LjgzNzY3NSIgeTE9IjM5LjYyNjk3OSIgeDE9IjEyLjk1ODg1IiBmaWxsLW9wYWNpdHk9Im51bGwiIHN0cm9rZS1vcGFjaXR5PSJudWxsIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz4gPC9nPjwvc3ZnPg==";
            values["icon"] = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+IDx0aXRsZS8+IDxkZXNjLz4gPGc+ICA8dGl0bGU+YmFja2dyb3VuZDwvdGl0bGU+ICA8cmVjdCBmaWxsPSJub25lIiBpZD0iY2FudmFzX2JhY2tncm91bmQiIGhlaWdodD0iNDAyIiB3aWR0aD0iNTgyIiB5PSItMSIgeD0iLTEiLz4gPC9nPiA8Zz4gIDx0aXRsZT5MYXllciAxPC90aXRsZT4gIDxwYXRoIGZpbGw9IiNmZmZmZmYiIGlkPSJTaGFwZSIgZD0ibTAsMTIuMDc0MTNsMTgsMGwwLC0ybC0xOCwwbDAsMmwwLDB6bTAsLTEybDAsMmwxOCwwbDAsLTJsLTE4LDBsMCwweiIvPiA8L2c+PC9zdmc+";
            values["color"] = "#5CDBD3";
            break;
          case "process":
            values["src"] = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAuMDAwMDAwMDAwMDAwMDEiIGhlaWdodD0iNjAuMDAwMDAwMDAwMDAwMDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+IDx0aXRsZS8+IDxkZXNjLz4gPGc+ICA8dGl0bGU+YmFja2dyb3VuZDwvdGl0bGU+ICA8cmVjdCBmaWxsPSJub25lIiBpZD0iY2FudmFzX2JhY2tncm91bmQiIGhlaWdodD0iNjIiIHdpZHRoPSI2MiIgeT0iLTEiIHg9Ii0xIi8+IDwvZz4gPGc+ICA8dGl0bGU+TGF5ZXIgMTwvdGl0bGU+ICA8ZWxsaXBzZSBzdHJva2U9Im51bGwiIHJ5PSIyOS42OTYyNDkiIHJ4PSIyOS42OTYyNDgiIGlkPSJzdmdfMSIgY3k9IjI5Ljk5OTk5OCIgY3g9IjMwIiBzdHJva2Utb3BhY2l0eT0ibnVsbCIgc3Ryb2tlLXdpZHRoPSJudWxsIiBmaWxsPSIjMTg5MGZmIi8+ICA8cGF0aCBzdHJva2U9Im51bGwiIGZpbGw9IiNmZmZmZmYiIGlkPSJTaGFwZSIgZD0ibTMwLjAwMDAwMSw5LjgxNjA2N2MtMTEuMjc0ODE3LDAgLTIwLjQ5OTY2Nyw5LjA4Mjc3IC0yMC40OTk2NjcsMjAuMTgzOTM0YzAsMTEuMTAxMTY0IDkuMjI0ODUsMjAuMTgzOTM0IDIwLjQ5OTY2NywyMC4xODM5MzRjMTEuMjc0ODE3LDAgMjAuNDk5NjY3LC05LjA4Mjc3IDIwLjQ5OTY2NywtMjAuMTgzOTM0YzAsLTExLjEwMTE2NCAtOS4yMjQ4NSwtMjAuMTgzOTM0IC0yMC40OTk2NjcsLTIwLjE4MzkzNGwwLDB6bTAsMzYuMzMxMDgxYy05LjAxOTg1NCwwIC0xNi4zOTk3MzQsLTcuMjY2MjE2IC0xNi4zOTk3MzQsLTE2LjE0NzE0N2MwLC04Ljg4MDkzMSA3LjM3OTg4LC0xNi4xNDcxNDcgMTYuMzk5NzM0LC0xNi4xNDcxNDdjOS4wMTk4NTQsMCAxNi4zOTk3MzQsNy4yNjYyMTYgMTYuMzk5NzM0LDE2LjE0NzE0N2MwLDguODgwOTMxIC03LjM3OTg4LDE2LjE0NzE0NyAtMTYuMzk5NzM0LDE2LjE0NzE0N2wwLDB6Ii8+IDwvZz48L3N2Zz4=";
            values["icon"] = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+IDx0aXRsZS8+IDxkZXNjLz4gPGc+ICA8dGl0bGU+YmFja2dyb3VuZDwvdGl0bGU+ICA8cmVjdCBmaWxsPSJub25lIiBpZD0iY2FudmFzX2JhY2tncm91bmQiIGhlaWdodD0iNDAyIiB3aWR0aD0iNTgyIiB5PSItMSIgeD0iLTEiLz4gPC9nPiA8Zz4gIDx0aXRsZT5MYXllciAxPC90aXRsZT4gIDxwYXRoIGZpbGw9IiNmZmZmZmYiIGlkPSJTaGFwZSIgZD0ibTEwLDBjLTUuNSwwIC0xMCw0LjUgLTEwLDEwYzAsNS41IDQuNSwxMCAxMCwxMGM1LjUsMCAxMCwtNC41IDEwLC0xMGMwLC01LjUgLTQuNSwtMTAgLTEwLC0xMGwwLDB6bTAsMThjLTQuNCwwIC04LC0zLjYgLTgsLThjMCwtNC40IDMuNiwtOCA4LC04YzQuNCwwIDgsMy42IDgsOGMwLDQuNCAtMy42LDggLTgsOGwwLDB6Ii8+IDwvZz48L3N2Zz4=";
            values["color"] = "#B37FEB";
            break;
        }

        this.assetsApi
          .put(`dfdType`, {
            assetId: item.model.id,
            shape: values["shape"],
            icon: values["icon"],
            src: values["src"],
            color: values["color"],
          })
          .then(() => {
            message.success("Type has been updated!");
            executeCommand(() => {
              update(item, { ...values });
            });
          });


      });
    }, 0);
  };

  renderEdgeShapeSelect = () => {
    return (
      <Select onChange={this.handleSubmit}>
        <Option value="flow-smooth">Smooth</Option>
        <Option value="flow-polyline">Polyline</Option>
        <Option value="flow-polyline-round">Polyline Round</Option>
      </Select>
    );
  };

  renderNodeDetail = () => {
    const { form } = this.props;
    const { label, shape } = this.item.getModel();

    console.log('')

    return (
      <div>
        <Item label="Label" {...inlineFormItemLayout}>
          {form.getFieldDecorator("label", {
            initialValue: label
          })(<Input onBlur={this.handleNameChangeSubmit} />)}
        </Item>
        {shape.includes('-dfd') && (
          <Item label="Type" {...inlineFormItemLayout}>
            {form.getFieldDecorator("entityType", {
              initialValue: shape.split('-')[3]
            })(
              <Select onChange={this.handleDfdTypeChangeSubmit}>
                <Option value="entity">Entity</Option>
                <Option value="process">Process</Option>
                <Option value="datastore">Data store</Option>
              </Select>
            )}
          </Item>
        )}
      </div>
    );
  };

  renderEdgeDetail = () => {
    const { form } = this.props;
    const { label = "", shape = "flow-smooth" } = this.item.getModel();

    return (
      <Fragment>
        <Item label="Label" {...inlineFormItemLayout}>
          {form.getFieldDecorator("label", {
            initialValue: label
          })(<Input onBlur={this.handleNameChangeSubmit} />)}
        </Item>
        <Item label="Shape" {...inlineFormItemLayout}>
          {form.getFieldDecorator("shape", {
            initialValue: shape
          })(this.renderEdgeShapeSelect())}
        </Item>
      </Fragment>
    );
  };

  renderGroupDetail = () => {
    const { form } = this.props;
    const { label = "test" } = this.item.getModel();


    return (
      <Item label="Label" {...inlineFormItemLayout}>
        {form.getFieldDecorator("label", {
          initialValue: label
        })(<Input onBlur={this.handleNameChangeSubmit} />)}
      </Item>
    );
  };

  render() {
    const { type } = this.props;
    const { label, shape } = this.item.getModel();
    console.log('render', label, shape, this.props.isDfd)

    if (!this.item) {
      return null;
    }
    if (this.item.mode !== undefined) this.item.model.payload["assetType"] = type;
    return (
      <Card type="inner" size="small" title={upperFirst(type)} bordered={false}>
        <Form onSubmit={this.handleSubmit}>
          {type === "node" && this.renderNodeDetail()}
          {type === "edge" && this.renderEdgeDetail()}
          {type === "group" && this.renderGroupDetail()}
        </Form>
        {(this.dfdStore.getCurrentDataType(this.item.model.payload) !== undefined || (shape === "flow-smooth" && this.props.isDfd === true)) && (<span>
          {this.dfdStore.getTag(this.dfdStore.getCompletedPercentage(this.item.model.payload))}
          <Button
            type="primary"
            icon="question"
            onClick={() => {
              const modal = Modal.info();
              modal.update({
                content: <DfdQuestionaire currentRecord={{ id: this.item.id, assetType: type, payload: (this.item.model.payload || undefined) }} nodes={this.props.nodes.nodes}></DfdQuestionaire>,
                width: '80%',
                mask: true,
                maskClosable: true,
                icon: null,
                okText: ' ',
                okButtonProps: { type: "link", block: true }
              })
            }}
          >
            DFD Questionaire
            </Button>
        </span>)}
      </Card>
    );
  }
}

export default Form.create()(withPropsAPI(DetailForm));
