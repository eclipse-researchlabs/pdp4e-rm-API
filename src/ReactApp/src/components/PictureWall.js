/* 
 *  Copyright (c) 2019,2021 Beawre Digital SL
 *  
 *  This program and the accompanying materials are made available under the
 *  terms of the Eclipse Public License 2.0 which is available at
 *  http://www.eclipse.org/legal/epl-2.0.
 *  
 *  SPDX-License-Identifier: EPL-2.0 3
 *  
 */

import React from "react";
import { Upload, Icon, Modal } from "antd";
import { withTranslation } from "react-i18next";
import ConfigStore from "../ConfigStore";

class PicturesWall extends React.Component {
  constructor() {
    super();
    this.state = {
      previewVisible: false,
      previewImage: "",
      fileList: []
    };
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };

  handleChange = ({ fileList }) => this.setState({ fileList });

  render() {
    const store = ConfigStore;
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">{this.props.t("common.upload")}</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload action={`${store.backendUrl}document/upload`} listType="picture-card" fileList={fileList} onPreview={this.handlePreview} onChange={this.handleChange}>
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default withTranslation()(PicturesWall);
