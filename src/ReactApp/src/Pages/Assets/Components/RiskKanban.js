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
        items: []
      }
    };
  }

  componentDidMount() {
    console.log('this.props.assets', this.props.assets)
    var kanbanData = this.state.kanbanData;
    kanbanData.items = this.props.assets;
    _.forEach(kanbanData.items, item => {
      var type = "identification";

      if(item.risks.length > 0) type = "riskassessment";
      if(item.treatments.length > 0) type = "controlsdefinition";
      if((item.evidences || []).length > 0) type = "treatmentcontrol";
      if(_.max(item.treatments.map(x => new Date(x.createdDateTime))) < _.max(item.risks.map(x => new Date(x.createdDateTime)))) type = "redisualriskassessment";

      kanbanData.columns[type].itemIds.push(item.id);
    })
    this.setState({ kanbanData })
  }

  render() {
    const data = this.state.kanbanData;
    return (
      <Row justify="space-between">
        <DragDropContext>
          {data.columnOrder.map(columnId => {
            // console.log('columnId', columnId)
            const column = data.columns[columnId];
            const items = data.items.filter(x => column.itemIds.includes(x.id));
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
