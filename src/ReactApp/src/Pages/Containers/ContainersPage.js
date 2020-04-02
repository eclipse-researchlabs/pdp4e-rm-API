import React from "react";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";

import {
  Table,
  Button,
  Card,
  Icon,
  notification,
  Modal,
  Input,
  Tag
} from "antd";
import BackendService from "./../../components/BackendService";
import ContainersStore from "./ContainersStore";

import * as _ from "lodash";

class ContainersPage extends React.Component {
  graphqlApi = new BackendService("graphql");

  constructor(props) {
    super(props);
    this.state = {
      containers: [],
      showCreateModal: false,
      newContainerName: ""
    };
  }

  componentDidMount() {
    this.graphqlApi.get("?query={containers{id,name}}").then(data => {
      const appConfig = JSON.parse(localStorage.getItem("appConfig"));
      if (appConfig.isOpenSource === true) {
        if (data.containers.length > 0)
          this.props.history.push(`/assets/${_.head(data.containers).id}`);
        else {
          ContainersStore.createNewContainer("New container").then(
            container => {
              this.props.history.push(`/assets/${container.id}`);
            }
          );
        }
      }
      this.setState({
        containers: data.containers.map(container => {
          return {
            ...container,
            riskStatus: this.getRandomInt(9, 70)
          };
        })
      });
    });
  }

  saveNewContainer(name) {
    if (!_.isEmpty(name)) {
      ContainersStore.createNewContainer(name).then(container => {
        console.log("newContainer", container);
        notification["success"]({
          message: "New Project Created",
          description: `You can now add asssets to project: ${name}`
        });
        this.setState({ newContainerName: "" });
        this.props.history.push(`/assets/${container.id}`);
      });
    }
  }

  toggleModal = () => {
    this.setState({ showCreateModal: !this.state.showCreateModal });
  };

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getTagOfType = name => {
    if (name.includes("DFD")) {
      return <Tag>DFD</Tag>;
    } else if (name.includes("Architecture")) {
      return <Tag>Architecture</Tag>;
    } else if (name.includes("dev") || name.includes("DEV")) {
      return <Tag>Development</Tag>;
    } else if (name.includes("New")) {
      return <Tag color="orange">New</Tag>;
    } else {
      return "";
    }
  };

  render() {
    return (
      <div>
        <h1>{this.props.t("Containers.title")}</h1>
        <Card>
          <Table
            columns={[
              { title: "Name", dataIndex: "name", key: "name" },
              {
                title: "Type",
                key: "type",
                dataIndex: "name",
                render: name => this.getTagOfType(name)
              },
              {
                title: (
                  <Button icon="plus" onClick={this.toggleModal} type="primary">
                    New Project
                  </Button>
                ),
                dataIndex: "action",
                ellipsis: true,
                fixed: "right",
                key: "action",
                render: (text, record, index) => (
                  <div>
                    <Link to={`/assets/${record.id}`}>
                      <Button type="primary" icon="arrow-right">
                        Open assets
                      </Button>
                    </Link>
                    <Button type="danger" icon="delete">
                      Remove
                    </Button>
                  </div>
                )
              }
            ]}
            dataSource={this.state.containers}
            rowKey="id"
          />
        </Card>
        <Modal
          visible={this.state.showCreateModal}
          onCancel={this.toggleModal}
          onOk={() => this.saveNewContainer(this.state.newContainerName)}
        >
          <small>Project Name</small>
          <Input
            onChange={i => this.setState({ newContainerName: i.target.value })}
          />
        </Modal>
      </div>
    );
  }
}

export default withTranslation()(ContainersPage);
