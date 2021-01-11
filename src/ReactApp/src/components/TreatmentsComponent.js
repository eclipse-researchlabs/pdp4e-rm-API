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
import { withTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { Row, Col, Card, Icon, Empty } from "antd";

export const TreatmentStatus = ({ status }) => {
  let icon = "check-circle";
  let color = "green";
  let text = "Implemented";

  switch (status) {
    case "implemented":
    default:
      icon = "check-circle";
      color = "green";
      text = "Implemented";
      break;
    case "exception":
      icon = "exclamation-circle";
      color = "red";
      text = "Exception";
      break;
    case "notImplemented":
      icon = "question-circle";
      color = "orange";
      text = "Not Implemented";
      break;
    case "planned":
      icon = "clock-circle";
      color = "orange";
      text = "Planned";
  }

  return (
    <Row style={{ textAlign: "center", marginTop: "15px" }}>
      <Col span={24}>
        <Icon type={icon} style={{ color, fontSize: "6em" }} theme="filled" />
      </Col>
      <Col span={24}>
        <h3>{text}</h3>
      </Col>
    </Row>
  );
};

class TreatmentsComponent extends React.Component {
  render() {
    const statuses = ["planned", "notImplemented", "exception", "implemented"];
    return (
      <Row gutter={16}>
        {this.props.asset.treatments.length === 0 && (
          <Empty
            description={this.props.t("Assets.analysis.risks.noTreatments")}
          />
        )}
        {this.props.asset.treatments.map((treatment, index) => (
          <Col span={8} style={{ marginBottom: "15px" }} key={`t_${index}`}>
            <Card
              hoverable
              cover={
                <TreatmentStatus
                  status={statuses[Math.floor(Math.random() * statuses.length)]}
                />
              }
              actions={[
                // <Icon type="dot-chart" />,
                // <Icon type="solution" />,
                // <Icon type="printer" />
              ]}
            >
              <Col span={24}>{treatment.name}</Col>
              <Col span={24}>
                {this.props.t(`Assets.analysis.treatments.${treatment.type}`)}
              </Col>
              <Col span={24}>
                <small>{treatment.description}</small>
              </Col>
            </Card>
          </Col>
        ))}
      </Row>
    );
  }
}

export default withTranslation()(observer(TreatmentsComponent));
