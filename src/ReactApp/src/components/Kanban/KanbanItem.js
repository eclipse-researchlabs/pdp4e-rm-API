import React from "react";
import { Card, Progress } from "antd";
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
              {this.props.item.name}
              <Progress
                percent={this.generateProgress()}
                size="small"
                status={this.generateStatus()}
              />
            </Card>
          </div>
        )}
      </Draggable>
    );
  }
}

export default KanbanItem;
