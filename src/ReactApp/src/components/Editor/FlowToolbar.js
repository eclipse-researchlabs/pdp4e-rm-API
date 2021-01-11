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
import { Divider } from "antd";
import { Toolbar } from "gg-editor";
import ToolbarButton from "./ToolbarButton";
import "./FlowToolbar.css";

const FlowToolbar = items => {
  return (
    <Toolbar className="toolbar" key={`item_toolbar_${items.length}`}>
      {items.items.map((item, index) =>
        item.type === "button" ? (
          <ToolbarButton command={item.command} icon={item.icon} text={item.text} key={`button_${item.text}_${index}`} />
        ) : (
          <Divider type="vertical" key={`divider_${index}`} />
        )
      )}
    </Toolbar>
  );
};

export default FlowToolbar;
