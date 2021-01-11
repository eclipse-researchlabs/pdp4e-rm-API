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
import { Card } from "antd";
import { Minimap } from "gg-editor";

const EditorMinimap = () => {
  return (
    <Card type="inner" size="small" title="Minimap" bordered={false}>
      <Minimap height={400} />
    </Card>
  );
};

export default EditorMinimap;
