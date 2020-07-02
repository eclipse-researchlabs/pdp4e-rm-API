import React from "react";
import Files from "react-files";
import { withTranslation } from "react-i18next";
import { Icon } from "antd";
import AssetsStore from "../Pages/Assets/AssetsStore";

class UploadFile extends React.Component {
  onFilesChange = files => {
    const fileReader = new FileReader();
    fileReader.readAsText(files[0]);

    // save to store
    const store = AssetsStore;
    store.rawImport = fileReader;

    fileReader.onload = e => store.parseRawImportToJson(this.props.containerId, fileReader);
  };

  onFilesError(err, file) {
    console.log("error,", err);
  }

  render() {
    return (
      <div className="ant-upload ant-upload-drag" style={{ height: "180px", paddingTop: "40px" }}>
        <Files
          className="files-dropzone"
          onChange={this.onFilesChange}
          onError={this.onFilesError}
          accepts={[".json"]}
          maxFileSize={10000000}
          minFileSize={1}
          multiple={false}
          clicable>
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">{this.props.t("Assets.upload.text")}</p>
        </Files>
      </div>
    );
  }
}

export default withTranslation()(UploadFile);
