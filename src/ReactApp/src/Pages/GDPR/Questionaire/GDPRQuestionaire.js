import React from "react";
import { observer } from "mobx-react";
import GDPRQuestionaireStore from "./GDPRQuestionaireStore";
import { Card, Row, Switch, Col, Collapse, Tag } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";

class GDPRQuestionaire extends React.Component {
  store = GDPRQuestionaireStore;

  changeValue = (value, storeHandler) => {
    storeHandler = value;
  };

  getTag = group => {
    const percent = this.store.getValueStats([group]);
    console.log("per", percent, group);
    if (percent > 99) {
      return <Tag color="green">Compliant in: {Math.round(percent)} %</Tag>;
    } else if (percent > 70) {
      return <Tag color="orange">Compliant in: {Math.round(percent)} %</Tag>;
    } else {
      return <Tag color="red">Compliant in: {Math.round(percent)} %</Tag>;
    }
  };

  render() {
    return (
      <div>
        <h1>GDPR Compliance Questionaires</h1>
        <Card>
          <Collapse defaultActiveKey={this.store.questions[0].key}>
            {this.store.questions.map(group => (
              <Collapse.Panel
                header={group.name}
                key={group.key}
                extra={this.getTag(group)}
              >
                <Collapse>
                  {group.children.map(section => (
                    <Collapse.Panel
                      header={
                        !!section.link ? (
                          <span>
                            {section.name}&nbsp;
                            <a href={section.link} target="_blank">
                              <small>Read more...</small>
                            </a>
                          </span>
                        ) : (
                          section.name
                        )
                      }
                      key={section.key}
                      extra={this.getTag(section)}
                    >
                      {section.children.map(subSection => (
                        <div>
                          {!!subSection.children && (
                            <div>
                              <h4>{subSection.name}</h4>
                              {subSection.children.map(subsubSection => (
                                <Row>
                                  <Col span={2}>
                                    <Switch
                                      checkedChildren="YES"
                                      unCheckedChildren="NO"
                                      checked={subsubSection.value}
                                      onChange={() => {
                                        subsubSection.value = !subsubSection.value;
                                        this.store.storeQuestionaire();
                                      }}
                                    />
                                  </Col>
                                  <Col span={22}>{subsubSection.name}</Col>
                                </Row>
                              ))}
                            </div>
                          )}
                          {!subSection.children && (
                            <Row>
                              <Col span={2}>
                                <Switch
                                  checkedChildren="YES"
                                  unCheckedChildren="NO"
                                  checked={subSection.value}
                                  onChange={() => {
                                    subSection.value = !subSection.value;
                                    this.store.storeQuestionaire();
                                  }}
                                />
                              </Col>
                              <Col span={22}>{subSection.name}</Col>
                            </Row>
                          )}
                        </div>
                      ))}
                    </Collapse.Panel>
                  ))}
                </Collapse>
              </Collapse.Panel>
            ))}
          </Collapse>
        </Card>
      </div>
    );
  }
}

export default observer(GDPRQuestionaire);
