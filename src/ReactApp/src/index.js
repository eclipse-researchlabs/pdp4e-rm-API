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

import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import i18n from "./components/i18n";
import { I18nextProvider } from "react-i18next";
import { Spin } from "antd";
import "./index.css";

const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href");
const rootElement = document.getElementById("root");

ReactDOM.render(
  <Suspense fallback={<Spin style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 200 }} size="large" />}>
    <BrowserRouter basename={baseUrl}>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </BrowserRouter>
  </Suspense>,
  rootElement
);

registerServiceWorker();
