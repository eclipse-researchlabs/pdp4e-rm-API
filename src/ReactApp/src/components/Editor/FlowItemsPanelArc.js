import React from "react";
import { Card } from "antd";
import { ItemPanel, Item } from "gg-editor";
import "./FlowItemPanel.css";

const FlowItemPanelArc = items => {
  return (
    <ItemPanel className="itemPanel">
      <Card bordered={false}>
        {items.items.map((x, i) => (
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
        ))}
      </Card>
    </ItemPanel>
  );
};

export default FlowItemPanelArc;
