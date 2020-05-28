import React from "react";
import { withTranslation } from "react-i18next";
import { observer } from "mobx-react";
import * as _ from "lodash";
import { Button, Modal, Input, Form, Popconfirm, notification, Row, Col, Card, Icon, AutoComplete, Empty, Slider, Popover, Switch, Select, Steps, Tag, Divider } from "antd";
import BackendService from "./BackendService";

const LCTag = ({ value }) => {
  let color = "";

  if (_.isEmpty(value)) {
    value = "-";
  }

  if (value === "low") {
    color = "green";
  } else if (value === "medium") {
    color = "orange";
  } else if (value === "high") {
    color = "red";
  }

  return <Tag color={color}>{value.toUpperCase()}</Tag>;
};

class RisksComponents extends React.Component {
  assetsApi = new BackendService("assets");
  risksApi = new BackendService("risks");
  treatmentsApi = new BackendService("treatments");
  treatmentTypes = ["process", "action", "configuration", "feature"];
  stride = ["SPOOFING", "TAMPERING", "REPUDIATION", "INFORMATION DISCLOSURE", "DENIAL OF SERVICE", "ELEVATION OF PRIVILEGES"];
  lindun = ["Linkability", "Identifiability", "Non-repudiation", "Detectability", "Disclosure of information", "Unawareness", "Non-compliance"];

  constructor() {
    super();
    this.state = {
      modalVisible: false,
      qualitive: false,
      step: 0,
      ...this.defaultEntry
    };
  }

  componentDidMount() {
    const appConfig = JSON.parse(localStorage.getItem("appConfig"));
    fetch(appConfig.risksDictionaryPath)
      .then(r => r.json())
      .then(r => {
        this.setState({ risksList: r.list });
      });
  }

  setNewValue(target, value) {
    let newEntry = this.state.newEntry;
    newEntry[target] = value;
    this.setState({ newEntry });
  }

  setNewTreatmentValue(target, value) {
    let newTreatment = this.state.newTreatment;
    newTreatment[target] = value;
    console.log('newTreatment', target, value)
    this.setState({ newTreatment });
  }

  connectObjects = allValues => {
    let newEntry = this.state.newEntry;
    newEntry.connections = { vulnerabilities: [], risks: [] };
    _.forEach(allValues, value => {
      var values = _.split(value, ":");
      switch (values[0]) {
        case "v":
          newEntry.connections.vulnerabilities.push(values[1]);
          break;
        case "r":
          newEntry.connections.risks.push(values[1]);
          break;
        default:
          break;
      }
    });
    this.setState({ newEntry });
  };

  setStride(category) {
    let newEntry = this.state.newEntry;
    newEntry.stride = category;
    this.setState({ newEntry });
  }

  setLindun(category) {
    let newEntry = this.state.newEntry;
    newEntry.lindun = category;
    this.setState({ newEntry });
  }

  saveNewEntry(nodeKey) {
    let newEntry = this.state.newEntry;
    if (!_.isEmpty(newEntry.name)) {

      var owaspValues = [];
      _.forEach(Object.keys(newEntry.owasp), key => {
        owaspValues.push({ name: key, value: newEntry.owasp[key] });
      });

      var objectData = {
        name: newEntry.name,
        description: newEntry.description,
        assetId: nodeKey,
        payloadData: {
          strideCategory: newEntry.stride,
          lindunCategory: newEntry.lindun,
          impact: newEntry.impact,
          impactText: newEntry.impactText,
          likelihood: newEntry.likelihood,
          likelihoodtext: newEntry.likelihoodText,
          owasp: owaspValues
        },
        vulnerabilities: newEntry.connections.vulnerabilities,
        risks: newEntry.connections.risks,
        treatments: newEntry.treatments
      };

      if (this.state.newEntry.id == undefined) {
        this.risksApi
          .post("", objectData)
          .then(r => r.json())
          .then(result => {
            notification.success({
              message: this.props.t("Assets.analysis.newEntryAdded"),
              description: this.props.t("Assets.analysis.newEntryAddedText") + newEntry.name
            });
            this.setState({ modalVisible: false });
            this.props.reloadData();
          });
      } else {
        objectData["id"] = this.state.newEntry.id;
        objectData["rootId"] = this.state.newEntry.rootId;
        this.risksApi
          .put("", objectData)
          .then(result => {
            notification.success({
              message: this.props.t("Assets.analysis.entryEdited"),
              description: this.props.t("Assets.analysis.entryEdited") + newEntry.name
            });
            this.setState({ modalVisible: false });
            this.props.reloadData();
          });
      }
    }
  }

  delete = (id) => {
    this.assetsApi.delete(`${this.props.nodeKey}/risks/${id}`).then(() => {
      this.props.reloadData();
    });
  }

  deleteTreatment = (id) => {
    this.assetsApi.delete(`${this.props.nodeKey}/treatments/${id}`).then(() => {
      var newEntry = this.state.newEntry;
      newEntry.treatments = newEntry.treatments.filter(x => x.id != id);
      this.setState({ newEntry });
      this.props.reloadData();
    });
  }

  saveNewTreatment(nodeKey) {
    let newEntry = this.state.newEntry;
    if (!_.isEmpty(this.state.newTreatment.description)) {
      this.treatmentsApi
        .post("", {
          type: this.treatmentTypes[this.state.newTreatment.type],
          description: this.state.newTreatment.description,
          assetId: nodeKey,
          name: this.state.newTreatment.name
        })
        .then(r => r.json())
        .then(result => {
          // TODO: send RiskId
          newEntry.treatments.push({
            id: result.id,
            description: this.state.newTreatment.description,
            type: this.treatmentTypes[this.state.newTreatment.type]
          });
          this.setState({ newTreatment: { description: "", type: 0 } });
        });
    }
  }

  getLCValue(value) {
    if (value <= 3) return "low";
    if (value <= 6) return "medium";
    if (value <= 9) return "high";
  }

  pushOwaspModel(dimension, subdimension, subsubdimension, value) {
    let newEntry = this.state.newEntry;
    newEntry.owasp[`${dimension}.${subdimension}.${subsubdimension}`] = value;
    this.setState({ newEntry });

    const likelihoodAvg = _.mean(Object.values(_.pickBy(this.state.newEntry.owasp, (value, key) => _.startsWith(key, "likelihood"))));
    const impactAvg = _.mean(Object.values(_.pickBy(this.state.newEntry.owasp, (value, key) => _.startsWith(key, "impact"))));
    // setLC value
    newEntry.likelihood = this.getLCValue(likelihoodAvg);
    newEntry.impact = this.getLCValue(impactAvg);
    this.setState({ newEntry });
  }

  render() {
    return (
      <div>
        <Button type="primary" icon="plus-circle" onClick={() => this.setState({ modalVisible: true, ...this.defaultEntry })} style={{ marginBottom: "25px" }}>
          {this.props.t(`Assets.analysis.risks.add`)}
        </Button>
        <Modal
          centered
          title={this.props.t(`Assets.analysis.risks.${this.state.newEntry.id == undefined ? `add` : `edit`}`)}
          visible={this.state.modalVisible}
          onOk={() => this.saveNewEntry(this.props.nodeKey)}
          onCancel={() => this.setState({ modalVisible: false })}
          afterClose={() => this.setState({ modalVisible: false })}
          destroyOnClose={true}
          width="90%">
          <Steps size="small" current={this.state.step}>
            <Steps.Step title={this.props.t("Assets.analysis.risks.steps.basic")} onClick={() => this.setState({ step: 0 })} />
            <Steps.Step title={this.props.t("Assets.analysis.risks.steps.LC")} onClick={() => this.setState({ step: 1 })} />
            <Steps.Step title={this.props.t("Assets.analysis.risks.steps.mitigations")} onClick={() => this.setState({ step: 2 })} />
          </Steps>
          <Form>
            {this.state.step === 0 && (
              <div>
                <Form.Item label={this.props.t("Assets.analysis.addName")}>
                  <AutoComplete
                    id="name"
                    dataSource={this.state.risksList}
                    onSelect={v => this.setNewValue("name", v)}
                    onChange={v => this.setNewValue("name", v)}
                    defaultOpen={false}
                    defaultValue={this.state.newEntry.name}
                  />
                </Form.Item>
                <Form.Item label={this.props.t("Assets.analysis.addDescription")}>
                  <Input.TextArea rows={4} id="description" onChange={v => this.setNewValue("description", v.target.value)} defaultValue={this.state.newEntry.description} />
                </Form.Item>
                <Form.Item label={this.props.t("Assets.analysis.risks.addLinks")}>
                  <Select defaultValue={this.state.newEntry.connectionsKeys} mode="tags" onChange={this.connectObjects}>
                    {this.props.asset.vulnerabilities.map((item, index) => {
                      return (
                        <Select.Option key={"vulnerabilities." + item.name} value={"v:" + item.rootId}>
                          Vulnerability:{item.name}
                        </Select.Option>
                      );
                    })}
                    {this.props.asset.risks.map((item, index) => {
                      return (
                        <Select.Option key={"risks." + item.name} value={"r:" + item.rootId}>
                          Risks:{item.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item label={this.props.t("Assets.analysis.risks.stride")}>
                  <Select defaultValue={this.state.newEntry.stride} onChange={index => this.setStride(index)}>
                    {this.stride.map(s => (
                      <Select.Option key={s}>{s}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label={this.props.t("Assets.analysis.risks.lindun")}>
                  <Select defaultValue={this.state.newEntry.lindun} onChange={index => this.setLindun(index)}>
                    {this.lindun.map(s => (
                      <Select.Option key={s}>{s}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            )}
            {this.state.step === 1 && (
              <div>
                <Row>
                  <Col span={2} offset={22}>
                    <Switch
                      checkedChildren="Qualitive"
                      unCheckedChildren="Quantitive"
                      checked={this.state.qualitive}
                      onChange={() => this.setState({ qualitive: !this.state.qualitive })}
                    />
                  </Col>
                </Row>
                {!this.state.qualitive && (
                  <Row>
                    {this.OWASPModel.map(group => (
                      <Col span={12} key={group.name}>
                        <h2>
                          {group.name}: <LCTag value={this.state.newEntry[group.name]} />
                        </h2>
                        {group.children.map(subgroup => (
                          <Col span={12} key={subgroup.name}>
                            <Popover content={subgroup.description}>
                              <h3>{subgroup.name}</h3>
                            </Popover>
                            {subgroup.children.map(subsubgroup => (
                              <Row key={subsubgroup.name}>
                                <Col span={24}>
                                  <h4>{subsubgroup.name}</h4>
                                  <p>
                                    <small>{subsubgroup.description}</small>
                                  </p>
                                </Col>
                                <Col span={23}>
                                  <span>
                                    <Slider min={1} max={9} defaultValue={this.state.newEntry.owasp[`${group.name}.${subgroup.name}.${subsubgroup.name}`] || 1} onChange={v => this.pushOwaspModel(group.name, subgroup.name, subsubgroup.name, v)} />
                                  </span>
                                </Col>
                              </Row>
                            ))}
                          </Col>
                        ))}
                      </Col>
                    ))}
                  </Row>
                )}
                {this.state.qualitive && (
                  <div>
                    <Form.Item
                      label={
                        <span>
                          Likelihood{" "}
                          <Select defaultValue={this.state.newEntry.likelihood || "low"} onChange={v => this.setNewValue("likelihood", v)}>
                            <Select.Option key="low">LOW</Select.Option>
                            <Select.Option key="medium">MEDIUM</Select.Option>
                            <Select.Option key="high">HIGH</Select.Option>
                          </Select>
                        </span>
                      }>
                      <Input.TextArea defaultValue={this.state.newEntry.likelihoodText} rows={2} id="likelihoood" onChange={e => this.setNewValue("likelihoodText", e.target.value)} placeholder="Describe the likelihood here..." />
                    </Form.Item>
                    <Form.Item
                      label={
                        <span>
                          Impact:{" "}
                          <Select defaultValue={this.state.newEntry.impact || "low"} onChange={v => this.setNewValue("impact", v)}>
                            <Select.Option key="low">LOW</Select.Option>
                            <Select.Option key="medium">MEDIUM</Select.Option>
                            <Select.Option key="high">HIGH</Select.Option>
                          </Select>
                        </span>
                      }>
                      <Input.TextArea defaultValue={this.state.newEntry.impactText} rows={2} id="impact" onChange={e => this.setNewValue("impactText", e.target.value)} placeholder="Describe the impact here..." />
                    </Form.Item>
                  </div>
                )}
              </div>
            )}
            {this.state.step === 2 && (
              <div>
                <Divider orientation="left">For Risk:</Divider>
                <Row>
                  <Col span={12}>
                    <p>{this.state.newEntry.name}</p>
                  </Col>
                  <Col span={12}>
                    <small>{this.state.newEntry.description}</small>
                  </Col>
                </Row>
                <Form.Item label={this.props.t("Assets.analysis.treatments.name")}>
                  <AutoComplete
                    id="name"
                    dataSource={this.treatmentsList}
                    onSelect={v => this.setNewTreatmentValue("name", v)}
                    onChange={v => this.setNewTreatmentValue("name", v)}
                    defaultOpen={false}
                  />
                </Form.Item>
                <Form.Item label={this.props.t("Assets.analysis.treatments.description")}>
                  <Input.TextArea rows={2} id="treatmentDescription" onChange={v => this.setNewTreatmentValue("description", v.target.value)} />
                </Form.Item>
                <Form.Item label={this.props.t("Assets.analysis.treatments.type")}>
                  <Select onChange={index => this.setNewTreatmentValue("type", index)}>
                    {this.treatmentTypes.map((treatmentName, index) => (
                      <Select.Option key={index}>{this.props.t(`Assets.analysis.treatments.${treatmentName}`)}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Button type="primary" onClick={() => this.saveNewTreatment(this.props.nodeKey)}>
                  <span>
                    <Icon type="plus" />
                    {this.props.t("Assets.analysis.treatments.add")}
                  </span>
                </Button>
                {this.state.newEntry.treatments.length === 0 && <Empty description={this.props.t("Assets.analysis.risks.noTreatments")} />}
                <Row gutter={16} style={{ marginTop: "20px" }}>
                  {this.state.newEntry.treatments.map((item, index) => (
                    <Col span={12} key={`treatment.${index}`}>
                      <Card
                        style={{ marginBottom: "15px" }}
                        title={`Type: ${this.props.t(`Assets.analysis.treatments.${item.type}`)}`}
                        actions={[
                          // <Icon type="edit" onClick={() => this.setState({ modalVisible: true, newEntry: { id: item.id, name: item.name, description: item.description } })} />,
                          <Popconfirm
                            title="Delete this treatment?"
                            onConfirm={() => this.deleteTreatment(item.id)}
                            onCancel={() => { }}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Icon type="delete" />
                          </Popconfirm>
                        ]}>
                        {item.description}
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
            <Row>
              <Col span={4} offset={20}>
                {this.state.step > 0 && (
                  <Button onClick={() => this.setState({ step: this.state.step - 1 })}>
                    <span>
                      <Icon type="backward" />
                      {this.props.t("Assets.analysis.back")}
                    </span>
                  </Button>
                )}
                {(this.state.step < 2) && (
                  <Button type="primary" onClick={() => this.setState({ step: this.state.step + 1 })}>
                    <span>
                      {this.props.t("Assets.analysis.next")}
                      <Icon type="forward" />
                    </span>
                  </Button>
                )}
              </Col>
            </Row>
          </Form>
        </Modal>
        <Row gutter={16}>
          {this.props.asset.risks.length === 0 && <Empty description={this.props.t("common.noData")} />}
          {this.props.asset.risks.map((item, index) => (
            <Col key={index} span={8}>
              <Card title={item.name} actions={[
                <Icon type="edit" onClick={() => this.setState({
                  modalVisible: true, newEntry: {
                    id: item.id, rootId: item.rootId, name: item.name, description: item.description, owasp: {}, treatments: item.treatments
                  }
                }, () => {
                  this.setNewValue(`likelihood`, item.payload.likelihood)
                  this.setNewValue(`likelihoodText`, item.payload.likelihoodText)
                  this.setNewValue(`impact`, item.payload.impact)
                  this.setNewValue(`impactText`, item.payload.impactText)
                  var connectionKeys = [];
                  connectionKeys.push(...item.risks.map(x => `r:` + x.rootId));
                  connectionKeys.push(...item.vulnerabilities.map(x => `v:` + x.rootId));
                  this.setNewValue(`connectionsKeys`, connectionKeys)
                  this.connectObjects(connectionKeys);
                  this.setLindun(item.payload.lindun)
                  this.setStride(item.payload.stride);
                  item.payload.owasp.map(x => {
                    var splitName = x.name.split('.');
                    this.pushOwaspModel(splitName[0], splitName[1], splitName[2], x.value);
                  })
                })} />,
                <Popconfirm
                  title="Delete this risk?"
                  onConfirm={() => this.delete(item.id)}
                  onCancel={() => { }}
                  okText="Yes"
                  cancelText="No"
                >
                  <Icon type="delete" />
                </Popconfirm>
              ]} style={{ marginBottom: "15px" }}>
                <Row>
                  <Col>{item.description}</Col>
                </Row>
                <Divider />
                <Col span={12}>
                  <small>
                    Likelihood: <LCTag value={item.payload.likelihood} />
                  </small>
                </Col>
                <Col span={12}>
                  <small>
                    Impact: <LCTag value={item.payload.impact} />
                  </small>
                </Col>
                <Col span={24}>
                  <small>LINDUN Category: </small> {item.payload.lindun || "-"}
                </Col>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  defaultEntry = {
    newEntry: {
      name: "",
      description: "",
      connections: { vulnerabilities: [], risks: [] },
      connectionsKeys: [],
      likelihood: "",
      likelihoodText: "",
      impact: "",
      impactText: "",
      owasp: {},
      treatments: [],
      stride: ""
    },
    newTreatment: {
      description: "",
      type: 0
    },
    risksList: []
  }
  treatmentsList = [
    "PET: Implement a Privacy Enhancing Identity Management System. ",
    "PET: Using Privacy Preserving biometrics for Private Authentication",
    "PET: Using Anonymous Credentials",
    "(D)TLS (PSK/RSA) to encrypt the traffic. There may be message protection add-ons available, such as PGP, or tunneling for channel protection may help.",
    "Strong pairing of the external entity to the device",
    "IDEM",
    "Encrypt the entire channel.",
    "Read Chapter 3 in 'Threat Modeling. Designing for Security'",
    "PET: Hide transactional data",
    "PET: Remove contextual data",
    "PET: Hide contextual data",
    "PET: Replace contextual data",
    "Information Disclosure of Data Store",
    "Minimization through hiding to protect receiver privacy",
    "Minimization through hiding to protect database privacy",
    "Minimization through generalization",
    "Information Disclosure of a process"
  ];
  OWASPModel = [
    {
      children: [
        {
          children: [
            {
              description:
                " How technically skilled is this group of threat agents? Security penetration skills (9), network and programming skills (6), advanced computer user (5), some technical skills (3), no technical skills (1)",
              name: "Skill level",
              id: "skillLevel"
            },
            {
              description: " How motivated is this group of threat agents to find and exploit this vulnerability? Low or no reward (1), possible reward (4), high reward (9)",
              name: "Motive",
              id: "motive"
            },
            {
              description:
                " What resources and opportunities are required for this group of threat agents to find and exploit this vulnerability? Full access or expensive resources required (0), special access or resources required (4), some access or resources required (7), no access or resources required (9)",
              name: "Opportunity",
              id: "opportunity"
            },
            {
              description:
                " How large is this group of threat agents? Developers (2), system administrators (2), intranet users (4), partners (5), authenticated users (6), anonymous Internet users (9)",
              name: "Size",
              id: "size"
            }
          ],
          description:
            "The first set of factors are related to the threat agent involved. The goal here is to estimate the likelihood of a successful attack by this group of threat agents. Use the worst-case threat agent.",
          name: "Threat Agent Factory"
        },
        {
          children: [
            {
              description:
                " How easy is it for this group of threat agents to discover this vulnerability? Practically impossible (1), difficult (3), easy (7), automated tools available (9)",
              name: "Ease of discovery",
              id: "easeOfDiscovery"
            },
            {
              description:
                " How easy is it for this group of threat agents to actually exploit this vulnerability? Theoretical (1), difficult (3), easy (5), automated tools available (9)",
              name: "Ease of exploit",
              id: "easeOfExploit"
            },
            {
              description: " How well known is this vulnerability to this group of threat agents? Unknown (1), hidden (4), obvious (6), public knowledge (9)",
              name: "Awareness",
              id: "awareness"
            },
            {
              description: " How likely is an exploit to be detected? Active detection in application (1), logged and reviewed (3), logged without review (8), not logged (9)",
              name: "Intrusion detection",
              id: "intrusionDetection"
            }
          ],
          description:
            "The next set of factors are related to the vulnerability involved. The goal here is to estimate the likelihood of the particular vulnerability involved being discovered and exploited. Assume the threat agent selected above.",
          name: "Vulnerability Factors"
        }
      ],
      description: "At the highest level, this is a rough measure of how likely this particular vulnerability is to be uncovered and exploited by an attacker.",
      name: "likelihood"
    },
    {
      children: [
        {
          children: [
            {
              description:
                " How much data could be disclosed and how sensitive is it? Minimal non-sensitive data disclosed (2), minimal critical data disclosed (6), extensive non-sensitive data disclosed (6), extensive critical data disclosed (7), all data disclosed (9)",
              name: "Loss of confidentiality",
              id: "lossOfConfidentiality"
            },
            {
              description:
                " How much data could be corrupted and how damaged is it? Minimal slightly corrupt data (1), minimal seriously corrupt data (3), extensive slightly corrupt data (5), extensive seriously corrupt data (7), all data totally corrupt (9)",
              name: "Loss of integrity",
              id: "lossOfIntegrity"
            },
            {
              description:
                " How much service could be lost and how vital is it? Minimal secondary services interrupted (1), minimal primary services interrupted (5), extensive secondary services interrupted (5), extensive primary services interrupted (7), all services completely lost (9)",
              name: "Loss of availability",
              id: "lossOfAvailability"
            },
            {
              description: " Are the threat agents' actions traceable to an individual? Fully traceable (1), possibly traceable (7), completely anonymous (9)",
              name: "Loss of accountability",
              id: "lossOfAccountability"
            }
          ],
          description:
            "Technical impact can be broken down into factors aligned with the traditional security areas of concern: confidentiality, integrity, availability, and accountability. The goal is to estimate the magnitude of the impact on the system if the vulnerability were to be exploited.",
          name: "Technical Impact Factors"
        },
        {
          children: [
            {
              description:
                " How much financial damage will result from an exploit? Less than the cost to fix the vulnerability (1), minor effect on annual profit (3), significant effect on annual profit (7), bankruptcy (9)",
              name: "Financial damage",
              id: "financialDamage"
            },
            {
              description:
                " Would an exploit result in reputation damage that would harm the business? Minimal damage (1), Loss of major accounts (4), loss of goodwill (5), brand damage (9)",
              name: "Reputation damage",
              id: "reputationDamage"
            },
            {
              description: " How much exposure does non-compliance introduce? Minor violation (2), clear violation (5), high profile violation (7)",
              name: "Non-compliance",
              id: "nonCompliance"
            },
            {
              description:
                " How much personally identifiable information could be disclosed? One individual (3), hundreds of people (5), thousands of people (7), millions of people (9)",
              name: "Privacy violation",
              id: "privacyViolation"
            }
          ],
          description:
            " The business impact stems from the technical impact, but requires a deep understanding of what is important to the company running the application. In general, you should be aiming to support your risks with business impact, particularly if your audience is executive level. The business risk is what justifies investment in fixing security problems.",
          name: "Business Impact Factors"
        }
      ],
      description:
        'When considering the impact of a successful attack, it\'s important to realize that there are two kinds of impacts. The first is the "technical impact" on the application, the data it uses, and the functions it provides. The other is the "business impact" on the business and company operating the application.',
      name: "impact"
    }
  ];
}

export default withTranslation()(observer(RisksComponents));
