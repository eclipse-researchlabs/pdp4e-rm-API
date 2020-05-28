import React from "react";
import { withTranslation } from "react-i18next";
import AnalysisStatus from "./../../../components/AnalysisStatus";
import {
  Table,
  Button,
  Tag, Icon, Input, Highlighter,
  Divider, Modal
} from "antd";
import BackendService from "./../../../components/BackendService";
import DfdQuestionaire from './DfdQuestionaire'
import { Link } from "react-router-dom";
import * as _ from "lodash";
import DfdStore from './DfdStore'

class AssetList extends React.Component {
  assetsApi = new BackendService(`assets`);
  dfdStore = DfdStore;

  constructor(props) {
    super(props);

    this.state = {
      nodes: props.nodes,
      showModal: false,
      questions: null,
      searchText: '',
    searchedColumn: '',
    };
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      (record[dataIndex] || "")
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => text
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  render() {
    const columns = [
      {
        title: this.props.t("Assets.table.component"),
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => (a.name || "").length - (b.name || "").length,
        sortDirections: ['descend', 'ascend'],
        ...this.getColumnSearchProps('name'),
      },
      {
        title: this.props.t("Assets.table.type"),
        dataIndex: "type",
        key: "type",
        sorter: (a, b) => (a.name || "").length - (b.name || "").length,
        sortDirections: ['descend', 'ascend'],
        filters: [
          {
            text: 'Entity',
            value: 'entity',
          },
          {
            text: 'Data store',
            value: 'dataStore',
          },
          {
            text: 'Process',
            value: 'process',
          },
          {
            text: 'Data flow',
            value: 'dataFlow',
          },
        ],
        filterMultiple: true,
        onFilter: (value, row) => { var type = this.dfdStore.getCurrentDataType(row.payload); if (type === undefined) return 0; return (this.dfdStore.getCurrentDataType(row.payload).indexOf(value) === 0) },
        render: (value, row) => {
          var type = this.dfdStore.getCurrentDataType(row.payload);
          return (<span>
            {type !== undefined && (
              <Tag>{this.props.t(`Dfd.types.${type}`)}</Tag>
            )}
          </span>)
        }
      },
      {
        title: this.props.t("Assets.table.status"),
        dataIndex: "status",
        key: "status",
        render: (value, row) => {
          var type = this.dfdStore.getCurrentDataType(row.payload);
          return (<span>
            {type !== undefined && (<span>
              {this.dfdStore.getTag(this.dfdStore.getCompletedPercentage(row.payload))}
            </span>)}
          </span>)
        }
      },
      {
        title: this.props.t("Assets.table.analysisStatus"),
        dataIndex: "analysis",
        key: "analysis",
        render: (value, row, index) => {
          return (
            <span>
              {this.state.nodes[index] !== undefined && (
                <span>
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
              )}
            </span>
          )
        }
      },
      {
        title: this.props.t("Assets.table.actions"),
        key: "actions",
        render: (text, record) => {
          var type = this.dfdStore.getCurrentDataType(record.payload);
          return (
            <Button.Group>
              <Link to={`/assets/analysis/${record.id}`}>
                <Button type="primary" icon="fund">
                  {this.props.t("Assets.goToAnalysis")}
                </Button>
              </Link>
              {type !== undefined && (
                <Button
                  type="primary"
                  icon="question"
                  onClick={() => {
                    const modal = Modal.info();
                    modal.update({
                      content: <DfdQuestionaire currentRecord={record} nodes={this.state.nodes}></DfdQuestionaire>,
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
              )}
            </Button.Group>
          )
        }
      }
    ];
    console.log('edgse', this.props.edges)
    return (
      <div>
        <Table
          columns={columns}
          dataSource={_.concat(
            this.state.nodes.map(node => ({ ...node, assetType: 'node', key: node.id })),
            this.props.edges.map(edge => { if (edge.payload === undefined) edge.payload = {}; edge.payload["Color"] = "#999999"; return ({ ...edge, assetType: 'edge', key: edge.id, payload: edge.payload, name: edge.label }) })
          )}
        />
      </div>
    );
  }
}

export default withTranslation()(AssetList);
