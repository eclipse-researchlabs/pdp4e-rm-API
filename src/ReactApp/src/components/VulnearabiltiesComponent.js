import React from "react";
import { withTranslation } from "react-i18next";
import { observer } from "mobx-react";
import * as _ from "lodash";
import { Button, Modal, Input, Form, notification, Popconfirm, Row, Col, Card, Icon, AutoComplete, Empty } from "antd";
import BackendService from "./BackendService";

class VulnerabiltiesComponent extends React.Component {
  assetsApi = new BackendService("assets");
  vulnerabilitiesApi = new BackendService("vulnerabilities");
  constructor() {
    super();
    this.state = {
      modalVisible: false,
      newEntry: {
        name: "",
        description: ""
      }
    };
  }

  setNewValue(target, value) {
    let newEntry = this.state.newEntry;
    newEntry[target] = value;
    this.setState({ newEntry });
  }

  saveNewEntry = (nodeKey) => {
    let newEntry = this.state.newEntry;
    if (!_.isEmpty(newEntry.name)) {

      if (newEntry.id == undefined) {
        this.vulnerabilitiesApi
          .post("", { name: newEntry.name, description: newEntry.description, assetId: nodeKey })
          .then(r => r.json())
          .then(result => {
            notification.success({
              message: this.props.t("Assets.analysis.newEntryAdded"),
              description: this.props.t("Assets.analysis.newEntryAddedText") + newEntry.name
            });

            this.props.asset.vulnerabilities.push(result);
            this.setState({ newEntry: { name: "", description: "" }, modalVisible: false });
          });
      } else {
        this.vulnerabilitiesApi
          .put("", { name: newEntry.name, description: newEntry.description, id: newEntry.id })
          .then(r => r.json())
          .then(result => {
            notification.success({
              message: this.props.t("Assets.analysis.entryEdited"),
              description: this.props.t("Assets.analysis.entryEditedText") + newEntry.name
            });

            this.props.reloadData();
            this.setState({ newEntry: { id: undefined, name: "", description: "" }, modalVisible: false });
          });
      }
    }
  }

  delete = (id) => {
    this.assetsApi.delete(`${this.props.nodeKey}/vulnerabilities/${id}`).then(() => {
      this.props.reloadData();
    });
  }

  render() {
    let list = [
      "Identifiable login is used and is communicated in an untrustworthy manner",
      "Identifiability of Transactional Data",
      "Identifiability of Contextual Data",
      "Weak Access Control to the Database",
      "Weak Anonymization/Inference",
      "Information disclosure of a process",
      //----
      "Missing data encryption",
      "OS command injection",
      "SQL injection",
      "Buffer overflow",
      "Missing authentication for critical function",
      "Missing authorization",
      "Unrestricted upload of dangerous file types",
      "Reliance on untrusted inputs in a security decision",
      "Cross-site scripting and forgery",
      "Download of codes without integrity checks",
      "Use of broken algorithms",
      "URL redirection to untrusted sites",
      "Path traversal",
      "Bugs",
      "Weak passwords",
      "Software that is already infected with virus"
    ];
    return (
      <div>
        <Button type="primary" icon="plus-circle" onClick={() => this.setState({ modalVisible: true, newEntry: { id: undefined, name: "", description: "" } })} style={{ marginBottom: "25px" }}>
          {this.props.t("Assets.analysis.vulnerabilities.add")}
        </Button>
        <Modal
          centered
          title={this.props.t(`Assets.analysis.vulnerabilities.${this.state.newEntry.id == undefined ? `add` : `edit`}`)}
          visible={this.state.modalVisible}
          onOk={() => this.saveNewEntry(this.props.nodeKey)}
          onCancel={() => this.setState({ modalVisible: false })}
          afterClose={() => this.setState({ modalVisible: false })}
          destroyOnClose={true}
          width="60%">
          <Form>
            <Form.Item label={this.props.t("Assets.analysis.addName")}>
              <AutoComplete
                id="name"
                dataSource={list}
                onSelect={v => this.setNewValue("name", v)}
                onChange={v => this.setNewValue("name", v)}
                defaultOpen={false}
                defaultValue={this.state.newEntry.name}
              />
            </Form.Item>
            <Form.Item label={this.props.t("Assets.analysis.addDescription")}>
              <Input.TextArea rows={4} id="description" onChange={v => this.setNewValue("description", v.target.value)} defaultValue={this.state.newEntry.description} />
            </Form.Item>
          </Form>
        </Modal>
        <Row gutter={16}>
          {this.props.asset.vulnerabilities.length === 0 && <Empty description={this.props.t("common.noData")} />}
          {this.props.asset.vulnerabilities.map((item, index) => (
            <Col key={index} span={8}>
              <Card title={item.name} actions={[
                <Icon type="edit" onClick={() => this.setState({ modalVisible: true, newEntry: { id: item.id, name: item.name, description: item.description } })} />,
                // <Icon type="copy" />,
                <Popconfirm
                  title="Delete this wulnearability?"
                  onConfirm={() => this.delete(item.id)}
                  onCancel={() => { }}
                  okText="Yes"
                  cancelText="No"
                >
                  <Icon type="delete" />
                </Popconfirm>
              ]} style={{ marginBottom: "15px" }}>
                {item.description}
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }
}

export default withTranslation()(observer(VulnerabiltiesComponent));
