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
import { Col, Card } from "antd";
import { Droppable } from "react-beautiful-dnd";
import KanbanItem from "./KanbanItem";

class KanbanColumn extends React.Component {
  render() {
    return (
      <Col span={4}>
        <Card
          title={this.props.column.title}
          style={{
            minHeight: 1000,
            marginRight: 5
          }}
        >
          <Droppable droppableId={this.props.column.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  minHeight: 600,
                  width: "100%",
                  backgroundColor: snapshot.isDraggingOver
                    ? "aliceblue"
                    : "white"
                }}
              >
                {this.props.items.map((item, index) => (
                  <KanbanItem item={item} index={index} key={`item-${index}`} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Card>
      </Col>
    );
  }
}

export default KanbanColumn;
