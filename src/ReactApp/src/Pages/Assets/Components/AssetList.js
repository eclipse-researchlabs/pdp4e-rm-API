import React from "react";
import { withTranslation } from "react-i18next";
import AnalysisStatus from "./../../../components/AnalysisStatus";
import {
  Table,
  Button,
  Tag,
  Divider,
  Modal,
  Radio,
  Row, Tooltip,
  Col,
  message,
} from "antd";
import BackendService from "./../../../components/BackendService";
import { Link } from "react-router-dom";
import * as _ from "lodash";

class AssetList extends React.Component {
  assetsApi = new BackendService(`assets`);

  constructor(props) {
    super(props);

    this.state = {
      nodes: props.nodes,
      showModal: false,
      questions: null,
      answeredEntries: 0,
      totalEntries: 1,
      currentRecord: {}
    };
  }

  componentDidMount() {
    fetch("dfdQuestionaire.json")
      .then(r => r.json())
      .then(r => {
        this.setState({ questions: r });
      });
  }

  showDfdQuestionaire = record => {
    console.log('showQue', record)
    this.setState({ showModal: !this.state.showModal });
    if (!_.isUndefined(record)) {
      this.setState({ currentRecord: record }, () => {
        this.updateQuestionaireList();
      });
    }
  };

  updateQuestionaire = (id, value) => {
    console.log('update', id, value)
    var questions = this.state.questions;
    questions[this.getCurrentDataType()].filter(x => x.Id == id)[0].value = value.target.value;
    this.setState({ questions }, () => this.updateQuestionaireList());
  }

  updateQuestionaireList = () => {
    var dfdAnswers = JSON.parse(this.state.currentRecord.payload || "{}")["DfdQuestionaire"]
    console.log(`answers`, dfdAnswers)

    var questions = this.state.questions;
    questions[this.getCurrentDataType()].forEach(entry => {
      var savedEntry = dfdAnswers.filter(x => x.id == entry.Id)[0];
      if (savedEntry == null) {
        if (entry.isVisible === undefined) {
          entry.isVisible = false;
          entry.value = 'na';
        }
        if (entry.requires != undefined) {
          var requiredCondition = questions[this.getCurrentDataType()].filter(x => x.Id == entry.requires)[0];
          if (requiredCondition != null && requiredCondition.value === 'yes') entry.isVisible = true;
          else entry.isVisible = false;
        } else
          entry.isVisible = true;
      } else {
        entry.isVisible = savedEntry.isVisible;
        entry.value = savedEntry.value;
      }
    })

    var totalEntries = questions[this.getCurrentDataType()].filter(x => x.isVisible).length;
    var answeredEntries = questions[this.getCurrentDataType()].filter(x => x.isVisible && x.value !== 'na').length;

    this.setState({ questions, totalEntries, answeredEntries })
  }

  saveProfile = () => {
    this.assetsApi.put(`dfdQuestionaire`, { assetId: this.state.currentRecord.id, payload: JSON.stringify(this.state.questions[this.getCurrentDataType()].map(x => { return ({ id: x.Id, value: x.value, isVisible: x.isVisible }) })) }).then(() => {
      message.success(`Questionaire saved!`)
    });

    // const index = _.findIndex(
    //   this.state.nodes,
    //   n => n.id === this.state.currentRecord.id
    // );
    // console.log(this.state.nodes, index, type, name, value);

    // if (index === -1) {
    //   return;
    // }

    // if (_.isUndefined(this.state.nodes[index].profile)) {
    //   console.log("not found");
    //   const newProfile = {};
    //   newProfile[name] = value;

    //   const newNode = {
    //     ...this.state.nodes[index],
    //     ...{
    //       profile: newProfile,
    //       profileType: type
    //     }
    //   };

    //   console.log(newNode);
    //   const newNodes = [...this.state.nodes];
    //   newNodes[index] = newNode;
    //   console.log("newNode", newNodes);
    //   this.setState({ nodes: newNodes });
    // } else {
    //   console.log("found");
    //   const newProfile = { ...this.state.nodes[index].profile };
    //   newProfile[name] = value;

    //   const newNode = {
    //     ...this.state.nodes[index],
    //     ...{
    //       profile: newProfile,
    //       profileType: type
    //     }
    //   };

    //   console.log("update", newNode);
    //   const newNodes = [...this.state.nodes];
    //   newNodes[index] = newNode;
    //   this.setState({ nodes: newNodes });
    // }
  };

  getTag = percent => {
    if (percent > 99) {
      return <Tag color="green">Compliant in: {Math.round(percent)} %</Tag>;
    } else if (percent > 70) {
      return <Tag color="orange">Compliant in: {Math.round(percent)} %</Tag>;
    } else {
      return <Tag color="red">Compliant in: {Math.round(percent)} %</Tag>;
    }
  };

  getCurrentDataType = () => {
    if (
      !_.isEmpty(this.state.currentRecord) &&
      !!this.state.currentRecord.payload
    ) {
      var color = JSON.parse(this.state.currentRecord.payload || {}).Color;
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
              {this.state.questions != null &&
                (<span>
                  {_.round(
                    (_.keys(this.state.nodes[index].profile).length /
                      this.state.questions[this.state.nodes[index].profileType || "entity"]
                        .length) *
                    100
                  ) + "%" || 0 + "%"}
                </span>)}
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
              onClick={() => this.showDfdQuestionaire(record)}
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
          title={<span>{this.getCurrentDataType()} {this.getTag((this.state.answeredEntries / this.state.totalEntries) * 100)}</span>}
          visible={this.state.showModal}
          onCancel={this.showDfdQuestionaire}
          footer={<Button type="primary" onClick={() => this.saveProfile()}>Save</Button>}
          width="75%"
        >
          {(this.state.questions != null) && (
            this.state.questions[this.getCurrentDataType()].map(question => (
              <Row style={{ padding: 10 }} key={question.Id}>
                <Col span={16}>
                  <Tooltip placement="top" title={question.description}>{question.title}</Tooltip>
                </Col>
                <Col span={8}>
                  <Radio.Group style={{ float: 'right' }} disabled={!(this.state.questions[this.getCurrentDataType()].filter(x => x.Id == question.Id)[0].isVisible)}
                    onChange={(e) => this.updateQuestionaire(question.Id, e)} defaultValue="na" value={this.state.questions[this.getCurrentDataType()].filter(x => x.Id == question.Id)[0].value} buttonStyle="solid">
                    <Radio.Button value="na">No answer</Radio.Button>
                    <Radio.Button value="yes">Yes</Radio.Button>
                    <Radio.Button value="no">No</Radio.Button>
                  </Radio.Group>
                </Col>
              </Row>
            )
            ))}
        </Modal>
      </div>
    );
  }
}

export default withTranslation()(AssetList);
