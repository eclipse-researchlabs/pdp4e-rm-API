import React from "react";
import { Tooltip } from "antd";
import { Command } from "gg-editor";
import IconFont from "./IconFont";
import styles from "./FlowToolbar.css";

const upperFirst = str => {
  return str.toLowerCase().replace(/( |^)[a-z]/g, l => l.toUpperCase());
};

const ToolbarButton = props => {
  const { command, icon, text } = props;

  return (
    <Command name={command}>
      <Tooltip title={text || upperFirst(command)} placement="bottom" overlayClassName={styles.tooltip}>
        <IconFont type={`icon-${icon || command}`} />
      </Tooltip>
    </Command>
  );
};

export default ToolbarButton;
