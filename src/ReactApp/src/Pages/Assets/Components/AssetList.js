import React from "react";
import { withTranslation } from "react-i18next";
import AnalysisStatus from "./../../../components/AnalysisStatus";
import {
  Table,
  Button,
  Tag,
  Divider, Modal
} from "antd";
import BackendService from "./../../../components/BackendService";
import DfdQuestionaire from './../../../components/DfdQuestionaire'
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
    };
  }

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
              onClick={() => {
                const modal = Modal.info();
                modal.update({
                  content: <DfdQuestionaire currentRecord={record} nodes={this.state.nodes}></DfdQuestionaire>,
                  width: '80%',
                  okText: "Close",
                  // onOk: this.
                })
              }}
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
      </div>
    );
  }
}

export default withTranslation()(AssetList);
