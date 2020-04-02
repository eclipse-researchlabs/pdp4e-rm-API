import React from "react";
import { withTranslation } from "react-i18next";
import { observer } from "mobx-react";
import * as _ from "lodash";
import AssetsStore from "../Pages/Assets/AssetsStore";
import { Button, Modal, Input, Form, notification, Row, Col, Card, Icon, Select, Empty } from "antd";

class UnwantedIncidentsComponent extends React.Component {
  store = AssetsStore;
  component = this.store.nodes[this.props.nodeKey];
  constructor() {
    super();
    this.state = {
      modalVisible: false,
      newEntry: {
        name: "",
        description: "",
        vulnerabilities: []
      }
    };
  }

  setNewValue(target, value) {
    let newEntry = this.state.newEntry;
    newEntry[target] = value;
    this.setState({ newEntry });
  }

  connectVulnerability(indexArray) {
    let newEntry = this.state.newEntry;
    newEntry.vulnerabilities = [];
    _.forEach(indexArray, index => {
      newEntry.vulnerabilities.push(this.store.nodes[this.props.nodeKey].analysis["vulnerabilities"][index]);
    });
    this.setState({ newEntry });
  }

  saveNewEntry(nodeKey) {
    let newEntry = this.state.newEntry;
    if (!_.isEmpty(newEntry.name)) {
      this.store.addNewAnalysis(nodeKey, "unwantedIncidents", newEntry);
      notification.success({
        message: this.props.t("Assets.analysis.newEntryAdded"),
        description: this.props.t("Assets.analysis.newEntryAddedText") + newEntry.name
      });
      this.setState({ newEntry: { name: "", description: "", vulnerabilities: [] }, modalVisible: false });
    }
  }

  render() {
    return (
      <div>
        <Button type="primary" icon="plus-circle" onClick={() => this.setState({ modalVisible: true })} style={{ marginBottom: "25px" }}>
          {this.props.t("Assets.analysis.vulnerabilities.add")}
        </Button>
        <Modal
          centered
          title={this.props.t("Assets.analysis.unwantedIncidents.add")}
          visible={this.state.modalVisible}
          onOk={() => this.saveNewEntry(this.props.nodeKey)}
          onCancel={() => this.setState({ modalVisible: false })}
          afterClose={() => this.setState({ modalVisible: false })}
          destroyOnClose={true}
          width="60%">
          <Form>
            <Form.Item label={this.props.t("Assets.analysis.addName")}>
              <Input id="name" onChange={v => this.setNewValue("name", v.target.value)} defaultValue={this.state.newEntry.name} />
            </Form.Item>
            <Form.Item label={this.props.t("Assets.analysis.addDescription")}>
              <Input.TextArea rows={4} id="description" onChange={v => this.setNewValue("description", v.target.value)} defaultValue={this.state.newEntry.description} />
            </Form.Item>
            <Form.Item label={this.props.t("Assets.analysis.unwantedIncidents.addLinks")}>
              <Select mode="tags" onChange={index => this.connectVulnerability(index)}>
                {this.store.nodes[this.props.nodeKey].analysis["vulnerabilities"].map((item, index) => {
                  return <Select.Option key={index}>{item.name}</Select.Option>;
                })}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
        <Row gutter={16}>
          {this.store.nodes[this.props.nodeKey].analysis["vulnerabilities"].length === 0 && <Empty description={this.props.t("common.noData")} />}
          {this.store.nodes[this.props.nodeKey].analysis["unwantedIncidents"].map((item, index) => (
            <Col key={index} span={8}>
              <Card title={item.name} actions={[<Icon type="edit" />, <Icon type="copy" />, <Icon type="delete" />]} style={{ marginBottom: "15px" }}>
                {item.description}
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }
}

export default withTranslation()(observer(UnwantedIncidentsComponent));
