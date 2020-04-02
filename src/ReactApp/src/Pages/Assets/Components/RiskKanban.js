import React from "react";
import { withTranslation } from "react-i18next";
import { Row } from "antd";
import { DragDropContext } from "react-beautiful-dnd";
import KanbanColumn from "../../../components/Kanban/KanbanColumn";
import * as _ from "lodash";

class RiskKanban extends React.Component {
  constructor(props) {
    super(props);

    var columns = {};
    _.forEach(this.props.columns, column => {
      columns[column.id] = { id: column.id, title: column.title, itemIds: [] };
    });

    // console.log("columns", columns);

    this.state = {
      kanbanData: {
        columns: columns,
        columnOrder: this.props.columnsOrder,
        items: {}
      }
    };
  }

  componentDidMount() {
    let items = {};
    let itemIds = [];
    // console.log("this.props.assets", this.props.assets);
    _.forEach(this.props.assets, node => {
      // console.log("risks", node.risks);
      if (!_.isEmpty(node.risks)) {
        _.forEach(node.risks, risk => {
          // console.log("risk", risk);
          items[risk.name] = risk;
          itemIds.push(risk.name);
        });
      }
    });
    const identification = this.state.kanbanData.columns.identification;
    //console.log("definition", identification);
    const newDefinitionItems = {
      ...identification,
      itemIds: itemIds
    };
    const newKanbanData = {
      ...this.state.kanbanData,
      items: items,
      columns: {
        ...this.state.kanbanData.columns,
        identification: newDefinitionItems
      }
    };
    const newState = {
      ...this.state,
      kanbanData: newKanbanData
    };
    //console.log("newState", newKanbanData);
    this.setState(newState);
  }

  onKanbanItemDragEnd = result => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const columns = this.state.kanbanData.columns;
    const from = columns[source.droppableId];
    const to = columns[destination.droppableId];

    const fromItemIds = Array.from(from.itemIds);
    fromItemIds.splice(source.index, 1);

    const toItemIds = Array.from(to.itemIds);
    toItemIds.splice(destination.index, 0, draggableId);

    const newFromColumn = {
      ...from,
      itemIds: fromItemIds
    };

    const newToColumn = {
      ...to,
      itemIds: toItemIds
    };

    columns[source.droppableId] = newFromColumn;
    columns[destination.droppableId] = newToColumn;

    const newColumns = {
      ...this.state.kanbanData.columns,
      ...columns
    };

    const newKanbanData = {
      ...this.state.kanbanData,
      columns: newColumns
    };
    const newState = {
      ...this.state,
      kanbanData: newKanbanData
    };
    this.setState(newState);
  };

  render() {
    const data = this.state.kanbanData;
    return (
      <Row justify="space-between">
        <DragDropContext onDragEnd={this.onKanbanItemDragEnd}>
          {data.columnOrder.map(columnId => {
            const column = data.columns[columnId];
            //console.log("column", column);
            const items = column.itemIds.map(itemId => data.items[itemId]);
            return (
              <KanbanColumn key={columnId} column={column} items={items} />
            );
          })}
        </DragDropContext>
      </Row>
    );
  }
}
export default withTranslation()(RiskKanban);
