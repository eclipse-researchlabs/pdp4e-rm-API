import React from "react";
import { withTranslation } from "react-i18next";
import AnalysisStatus from "./../../../components/AnalysisStatus";
import {
  Table,
  Button,
  Tag,
  Divider,
  Modal,
  Collapse,
  Row,
  Col,
  Switch
} from "antd";
import { Link } from "react-router-dom";
import * as _ from "lodash";

class AssetList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nodes: props.nodes,
      showModal: false,
      currentRecord: {}
    };
  }

  handleModalChange = record => {
    this.setState({ showModal: !this.state.showModal });
    if (!_.isUndefined(record)) {
      this.setState({ currentRecord: record });
    }
  };

  saveProfile = (type, name) => value => {
    const index = _.findIndex(
      this.state.nodes,
      n => n.id === this.state.currentRecord.id
    );
    console.log(this.state.nodes, index, type, name, value);

    if (index === -1) {
      return;
    }

    if (_.isUndefined(this.state.nodes[index].profile)) {
      console.log("not found");
      const newProfile = {};
      newProfile[name] = value;

      const newNode = {
        ...this.state.nodes[index],
        ...{
          profile: newProfile,
          profileType: type
        }
      };

      console.log(newNode);
      const newNodes = [...this.state.nodes];
      newNodes[index] = newNode;
      console.log("newNode", newNodes);
      this.setState({ nodes: newNodes });
    } else {
      console.log("found");
      const newProfile = { ...this.state.nodes[index].profile };
      newProfile[name] = value;

      const newNode = {
        ...this.state.nodes[index],
        ...{
          profile: newProfile,
          profileType: type
        }
      };

      console.log("update", newNode);
      const newNodes = [...this.state.nodes];
      newNodes[index] = newNode;
      this.setState({ nodes: newNodes });
    }
  };

  getCurrentDataType = () => {
    console.log("get", this.state.currentRecord);
    if (
      !_.isEmpty(this.state.currentRecord) &&
      !!this.state.currentRecord.payload
    ) {
      var color = JSON.parse(this.state.currentRecord.payload || {}).Color;
      console.log("color", color);
      if (color === "#69C0FF") {
        return "dataFlow";
      } else if (color === "#B37FEB") {
        return "process";
      } else if (color === "#5CDBD3") {
        return "dataStore";
      }
    }
    return "entity";
  };

  render() {
    const questions = {
      entity: [
        "Entity: represents data subject? ",
        "Entity: proxy to data subjects?",
        "Entity: Authenticated to execute this DFD?",
        "Entity: Untrustworthy receiver entity?",
        "Entity (endpoint of data flow): Can data in the DFD be shared with third-parties (e.g. subcontractors?)",
        "Entity:  Is this an external entity?",
        "Entity: Entity can link different accounts?",
        "Entity: requires plausible deniability?"
      ],
      dataFlow: [
        "Data flow needs to authenticate messages",
        "Deniable encryption necessary?",
        "Data flow used for instant messaging conversations",
        "Are logins transmitted through this data flow?",
        "Anonymous communication not used? ",
        "Public network connections? ",
        "is data broadcasted?",
        "Network traffic of data flow is logged?",
        "Some actions lead to generate footprints in the communication channel? (e.g. Timing information, power consumption, electromagnetic leaks)",
        "Very low data traffic in the channel (Continuous monitoring)",
        "Covert channel used to avoid dectability?",
        "Channel not encrypted?",
        "Is the communication channel wireless?",
        "message not encrypted?",
        "Is receiver authenticated"
      ],
      dataStore: [
        "Data store: includes login data, like an identity management database does?",
        "Deniable encryption necessary?",
        "Data store: contains privacy policies / consent?",
        "Data stored for purposes such as change tracking, etc.?",
        "Data stored requires protection",
        "Does code rely on a name, such as a file name, to determine access?",
        "data store access is not monitored",
        "does overcapacity result in discarding data?",
        "does overcapacity result in overwriting previous data?",
        "is this data store accessed by processes that may be using different control access policies (e.g : a file to which users are not granted access in the filesystem, but they can access through using OneDrive)",
        "Is data encrypted?"
      ],
      process: [
        "Process activity is logged",
        "process accepts data input",
        "does this process useoutput systems such as screen or audio? (e.g. Showing confidential information on the screen while sharing)",
        "aspects of behavior such as a disk filling up or being slow can reveal information? (or timing, filesystem effects, power draw, emissions (sound, other radiation), etc)",
        "process places sensitive data in memory",
        "are process callers filtered out by domain?",
        "call chain checked?",
        "are credentials required to execute this process"
      ]
    };
    const columns = [
      {
        title: this.props.t("Assets.table.component"),
        dataIndex: "name",
        key: "name"
      },
      {
        title: this.props.t("Assets.table.analysisStatus"),
        dataIndex: "analysis",
        key: "analysis",
        render: (value, row, index) => (
          <span>
            <Tag>
              Profile:{" "}
              {_.round(
                (_.keys(this.state.nodes[index].profile).length /
                  questions[this.state.nodes[index].profileType || "entity"]
                    .length) *
                  100
              ) + "%" || 0 + "%"}
            </Tag>
            <Divider type="vertical" />
            <AnalysisStatus
              key={"vulnerabilities"}
              title={"vulnerabilities"}
              count={this.state.nodes[index].vulnerabilities.length}
            />
            <AnalysisStatus
              key={"risks"}
              title={"risks"}
              count={this.state.nodes[index].risks.length}
            />
            <AnalysisStatus
              key={"treatments"}
              title={"treatments"}
              count={this.state.nodes[index].treatments.length}
            />
          </span>
        )
      },
      {
        title: this.props.t("Assets.table.actions"),
        key: "actions",
        render: (text, record) => (
          <Button.Group>
            <Link to={`/assets/analysis/${record.id}`}>
              <Button type="primary" icon="fund">
                {this.props.t("Assets.goToAnalysis")}
              </Button>
            </Link>
            <Button
              type="primary"
              icon="question"
              onClick={() => this.handleModalChange(record)}
            >
              DFD Questionaire
            </Button>
          </Button.Group>
        )
      }
    ];
    return (
      <div>
        <Table
          columns={columns}
          dataSource={this.state.nodes.map(node => ({ ...node, key: node.id }))}
        />
        <Modal
          visible={this.state.showModal}
          onCancel={this.handleModalChange}
          footer={null}
          width="75%"
        >
          <Collapse
            accordion
            style={{ marginTop: 20 }}
            activeKey={this.getCurrentDataType()}
          >
            {Object.keys(questions).map(key => (
              <Collapse.Panel
                header={_.capitalize(key.replace(/([a-z](?=[A-Z]))/g, "$1 "))}
                key={key}
              >
                {questions[key].map(question => (
                  <Row style={{ padding: 10 }} key={question}>
                    <Col span={22}>{question}</Col>
                    <Col span={2}>
                      <Switch onChange={this.saveProfile(key, question)} />
                    </Col>
                  </Row>
                ))}
              </Collapse.Panel>
            ))}
          </Collapse>
        </Modal>
      </div>
    );
  }
}

export default withTranslation()(AssetList);
