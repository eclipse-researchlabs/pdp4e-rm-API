import React from "react";
import { withTranslation } from "react-i18next";
import { Card, Col, Icon, Row } from "antd";
import { TreatmentStatus } from "../../../components/TreatmentsComponent";
import * as _ from "lodash";

class TreatmentStatusCards extends React.Component {
  getAllTreatments(data) {
    return _(data)
      .map(node =>
        node.risks.map(risk =>
          risk.treatments.map(treatment => {
            return {
              risk: risk.name,
              node: node.name,
              ...treatment
            };
          })
        )
      )
      .flattenDepth(2)
      .value();
  }
  render() {
    const statuses = ["planned", "notImplemented", "exception", "implemented"];
    //console.log("props", this.props);
    return (
      <div>
        {this.getAllTreatments(this.props.data).map((treatment, index) => (
          <Card
            hoverable
            actions={[
              <Icon type="dot-chart" />,
              <Icon type="solution" />,
              <Icon type="printer" />
            ]}
            key={`t_${index}`}
            style={{ marginRight: 15, marginBottom: 15 }}
          >
            <Card.Meta
              title={treatment.description}
              description={
                <Row>
                  <Col>
                    <TreatmentStatus
                      status={
                        statuses[Math.floor(Math.random() * statuses.length)]
                      }
                    />
                  </Col>
                  <Col>
                    <div>
                      <span>
                        <small>Type</small>
                        <p>
                          {" "}
                          {this.props.t(
                            `Assets.analysis.treatments.${treatment.type}`
                          )}{" "}
                        </p>
                      </span>
                      <span>
                        <small>Node</small>
                        <p>{treatment.node}</p>
                      </span>
                      <span>
                        <small>Risk</small>
                        <p>{treatment.risk}</p>
                      </span>
                    </div>
                  </Col>
                </Row>
              }
            />
          </Card>
        ))}
      </div>
    );
  }
}

export default withTranslation()(TreatmentStatusCards);
