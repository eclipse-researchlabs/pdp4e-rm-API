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
