import React from "react";
import { RegisterNode } from "gg-editor";

class KoniCustomNode extends React.Component {
  render() {
    const config = {
      draw(item) {
        const keyShape = this.drawKeyShape(item);

        // draw label
        this.drawLabel(item);

        // draw image
        const group = item.getGraphicGroup();
        const model = item.getModel();

        var sizes = [model.size, model.size];
        if (model.size.includes("*")) sizes = model.size.split("*");

        group.addShape("image", {
          attrs: {
            x: -(sizes[0] / 2),
            y: -(sizes[1] / 2),
            width: sizes[0],
            height: sizes[1],
            // src: model.icon
            img: model.icon
          }
        });

        return keyShape;
      },
      anchor(item) {
        return [
          [0.2, 0], [0.5, 0], [0.8, 0],
          [0, 0.2], [0, 0.5], [0, 0.8],
          [1, 0.2], [1, 0.5], [1, 0.8],
          [0.2, 1], [0.5, 1], [0.8, 1],
        ]
      }
    };

    return <RegisterNode name="koni-custom-node" config={config} />;
  }
}

export default KoniCustomNode;
