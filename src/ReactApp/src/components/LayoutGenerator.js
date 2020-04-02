import React, { Component } from "react";

class LayoutGenerator extends React {
  extractView(layout) {
    // console.log("layout", layout);
    if (layout === undefined || layout === null) return;
    var layouts = [];
    _.forEach(Object.keys(layout), item => {
      layouts.push(this.extractElement(item, layout[item]));
    });
    return layouts;
  }

  extractElement(type, layout) {
    switch (type.toLowerCase()) {
      default:
        return {};
    }
  }

  extractPage(page) {
    const appConfig = JSON.parse(localStorage.getItem("appConfig"));
    return appConfig.pages[page];
  }
}

export default LayoutGenerator();
