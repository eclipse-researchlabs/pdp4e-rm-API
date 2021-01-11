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
import { Card, Row, Col } from "antd";
import { ItemPanel, Item } from "gg-editor";
import "./FlowItemPanel.css";

const FlowItemPanelArc = items => {
  return (
    <ItemPanel className="itemPanel">
      <Row gutter="8">
        {items.items.map((x, i) => (
          <Col span={"8"}>
            <Card bordered={false}>
              <Item
                key={`item_arc_${i}`}
                type={x.type}
                size={x.size}
                shape={x.shape}
                model={{
                  color: x.model.color,
                  label: x.model.label,
                  src: x.src,
                  labelOffsetY: x.model.labelOffsetY,
                  icon: x.icon
                }}
                src={x.src}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </ItemPanel>
  );
};

export default FlowItemPanelArc;
