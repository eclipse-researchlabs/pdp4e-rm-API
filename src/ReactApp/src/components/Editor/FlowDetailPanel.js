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
import { Card } from "antd";
import { NodePanel, EdgePanel, GroupPanel, MultiPanel, CanvasPanel, DetailPanel } from "gg-editor";
import DetailForm from "./DetailForm";
import "./FlowDetailPanel.css";

const FlowDetailPanel = (data) => {
  console.log('nodes,', data)
  return (
    <DetailPanel className="detailPanel">
      <NodePanel>
        <DetailForm nodes={data.nodes} type="node" />
      </NodePanel>
      <EdgePanel>
        <DetailForm nodes={data.nodes} type="edge" isDfd={data.isDfd} />
      </EdgePanel>
      <GroupPanel>
        <DetailForm type="group" />
      </GroupPanel>
      <MultiPanel>
        <Card type="inner" size="small" title="Multi Select" bordered={false} />
      </MultiPanel>
      <CanvasPanel>
        <Card type="inner" size="small" title="Canvas" bordered={false} />
      </CanvasPanel>
    </DetailPanel>
  );
};

export default FlowDetailPanel;
