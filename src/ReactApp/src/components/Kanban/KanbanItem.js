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
import { Card, Progress, Tag, Row, Col } from "antd";
import { Draggable } from "react-beautiful-dnd";

class KanbanItem extends React.Component {
  generateProgress() {
    return Math.round(Math.random() * (101 - 1) + 1);
  }

  generateStatus() {
    var status = [
      "normal",
      "exception",
      "active",
      "success",
      "normal",
      "normal",
      "normal",
      "normal",
      "normal",
      "normal"
    ];

    return status[Math.floor(Math.random() * status.length)];
  }

  render() {
    return (
      <Draggable draggableId={this.props.item.name} index={this.props.index}>
        {(provided, snapshot) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <Card
              hoverable
              style={{
                marginBottom: 15,
                borderRadius: 5,
                backgroundColor: "rgba(99, 99, 99,0.04)"
              }}
            >
              <Row>
                <Col span={12}>
                  {this.props.item.name}
                </Col>
                <Col span={12}>
                  <div>
                    <Tag color="magenta">V: {this.props.item.vulnerabilities.length}</Tag>
                    <Tag color="red">R: {this.props.item.risks.length}</Tag>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Tag color="volcano">T: {this.props.item.treatments.length}</Tag>
                    <Tag color="orange">E: {(this.props.item.evidences || []).length}</Tag>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        )}
      </Draggable>
    );
  }
}

export default KanbanItem;
