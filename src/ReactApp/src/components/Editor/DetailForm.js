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

  handleSubmit = e => {
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
    const { label } = this.item.getModel();

    return (
      <Item label="Label" {...inlineFormItemLayout}>
        {form.getFieldDecorator("label", {
          initialValue: label
        })(<Input onBlur={this.handleSubmit} />)}
      </Item>
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
          })(<Input onBlur={this.handleSubmit} />)}
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
        })(<Input onBlur={this.handleSubmit} />)}
      </Item>
    );
  };

  render() {
    const { type } = this.props;

    if (!this.item) {
      return null;
    }
    this.item.model.payload["assetType"] = type;
    return (
      <Card type="inner" size="small" title={upperFirst(type)} bordered={false}>
        <Form onSubmit={this.handleSubmit}>
          {type === "node" && this.renderNodeDetail()}
          {type === "edge" && this.renderEdgeDetail()}
          {type === "group" && this.renderGroupDetail()}
        </Form>
        {this.dfdStore.getCurrentDataType(this.item.model.payload) !== undefined && (<span>
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
