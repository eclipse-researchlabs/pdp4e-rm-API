import React, { Component } from "react";
import {
  Query,
  Builder,
  BasicConfig,
  Utils
} from "react-awesome-query-builder";
import throttle from "lodash/throttle";
import loadedConfig from "./config";
import * as _ from "lodash";

import DocumentStore from "../../Pages/Documents/DocumentsStore";

const { getTree, checkTree, loadTree, uuid } = Utils;
const emptyInitValue = { id: uuid(), type: "group" };

export default class QueryBuilderComponent extends Component {
  documentStore = DocumentStore;

  state = {
    tree: undefined,
    loading: true
  };

  componentDidMount() {
    loadedConfig.fields = this.props.fields;
    let initTree = checkTree(
      loadTree(
        _.isUndefined(this.props.queryString)
          ? emptyInitValue
          : this.props.queryString,
        loadedConfig
      ),
      loadedConfig
    );
    this.setState({ tree: initTree, loading: false });
  }

  render = () => {
    return (
      <div>
        {!this.state.loading && (
          <Query
            {...loadedConfig}
            value={this.state.tree}
            onChange={this.onChange}
            renderBuilder={this.renderBuilder}
          />
        )}
      </div>
    );
  };

  renderBuilder = props => (
    <div className="query-builder-container" style={{ padding: "10px" }}>
      <div className="query-builder qb-lite">
        <Builder {...props} />
      </div>
    </div>
  );

  onChange = (immutableTree, config) => {
    this.immutableTree = immutableTree;
    this.config = config;
    this.updateResult();
    const jsonTree = getTree(immutableTree); //can be saved to backend
    if (this.props.page === "documents" || this.props.page === "analytics") {
      this.documentStore.queryBuilderJson = jsonTree;
    } else if(this.props.page === "tasks") {
      this.taskStore.queryBuilderJson = jsonTree;
    }  
  };

  updateResult = throttle(() => {
    this.setState({ tree: this.immutableTree, config: this.config });
    this.props.history.push({
      pathname: `/${this.props.page}`,
      search:
        "?query=" +
        encodeURIComponent(JSON.stringify(getTree(this.immutableTree)))
    });
  }, 100);
}
