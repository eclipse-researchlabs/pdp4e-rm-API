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
