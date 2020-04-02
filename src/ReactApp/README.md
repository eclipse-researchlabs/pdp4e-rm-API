## Saved BPMN editor

``

              "ggeditor": {
                "itemPanels": [{
                    "type": "node",
                    "size": "50",
                    "shape": "koni-custom-node",
                    "model": {
                      "color": "#FFFFFF",
                      "label": "Start",
                      "labelOffsetY": 48
                    },
                    "icon": "http://localhost:5410/bpmn/events/start-event-none.svg",
                    "src": "http://localhost:5410/bpmn/events/start-event-none.svg"
                  },
                  {
                    "type": "node",
                    "size": "50",
                    "shape": "koni-custom-node",
                    "model": {
                      "color": "#FFFFFF",
                      "label": "End",
                      "labelOffsetY": 48
                    },
                    "icon": "http://localhost:5410/bpmn/events/end-event-none.svg",
                    "src": "http://localhost:5410/bpmn/events/end-event-none.svg"
                  },
                  {
                    "type": "node",
                    "size": "50",
                    "shape": "koni-custom-node",
                    "model": {
                      "color": "#FFFFFF",
                      "label": "Intermediate",
                      "labelOffsetY": 48
                    },
                    "icon": "http://localhost:5410/bpmn/events/intermediate-event-none.svg",
                    "src": "http://localhost:5410/bpmn/events/intermediate-event-none.svg"
                  },
                  {
                    "type": "node",
                    "size": "50",
                    "shape": "koni-custom-node",
                    "model": {
                      "color": "#FFFFFF",
                      "label": "Gateway xor",
                      "labelOffsetY": 48
                    },
                    "icon": "http://localhost:5410/bpmn/gateways/gateway-xor.svg",
                    "src": "http://localhost:5410/bpmn/gateways/gateway-xor.svg"
                  },
                  {
                    "type": "node",
                    "size": "50",
                    "shape": "koni-custom-node",
                    "model": {
                      "color": "#FFFFFF",
                      "label": "Gateway parallel",
                      "labelOffsetY": 48
                    },
                    "icon": "http://localhost:5410/bpmn/gateways/gateway-parallel.svg",
                    "src": "http://localhost:5410/bpmn/gateways/gateway-parallel.svg"
                  },
                  {
                    "type": "node",
                    "size": "50",
                    "shape": "koni-custom-node",
                    "model": {
                      "color": "#FFFFFF",
                      "label": "Task",
                      "labelOffsetY": 48
                    },
                    "icon": "http://localhost:5410/bpmn/task.svg",
                    "src": "http://localhost:5410/bpmn/task.svg"
                  },
                  {
                    "type": "node",
                    "size": "50",
                    "shape": "koni-custom-node",
                    "model": {
                      "color": "#FFFFFF",
                      "label": "Send task",
                      "labelOffsetY": 48
                    },
                    "icon": "http://localhost:5410/bpmn/activities/send-task.svg",
                    "src": "http://localhost:5410/bpmn/activities/send-task-big.svg"
                  }
                ],
                "toolbarItems": [{
                    "type": "button",
                    "command": "undo"
                  },
                  {
                    "type": "button",
                    "command": "redo"
                  },
                  {
                    "type": "divider"
                  },
                  {
                    "type": "button",
                    "command": "copy"
                  },
                  {
                    "type": "button",
                    "command": "paste"
                  },
                  {
                    "type": "button",
                    "command": "delete"
                  },
                  {
                    "type": "divider"
                  },
                  {
                    "type": "button",
                    "command": "zoomIn",
                    "icon": "zoom-in",
                    "text": "Zoom In"
                  },
                  {
                    "type": "button",
                    "command": "zoomOut",
                    "icon": "zoom-out",
                    "text": "Zoom Out"
                  },
                  {
                    "type": "button",
                    "command": "autoZoom",
                    "icon": "fit-map",
                    "text": "Fit map"
                  },
                  {
                    "type": "button",
                    "command": "resetZoom",
                    "icon": "actual-size",
                    "text": "Actual size"
                  },
                  {
                    "type": "divider"
                  },
                  {
                    "type": "button",
                    "command": "toBack",
                    "icon": "to-back",
                    "text": "To back"
                  },
                  {
                    "type": "button",
                    "command": "toFront",
                    "icon": "to-front",
                    "text": "To front"
                  },
                  {
                    "type": "divider"
                  },
                  {
                    "type": "button",
                    "command": "multiSelect",
                    "icon": "multi-select",
                    "text": "Multi select"
                  },
                  {
                    "type": "button",
                    "command": "addGroup",
                    "icon": "group",
                    "text": "Add group"
                  },
                  {
                    "type": "button",
                    "command": "unGroup",
                    "icon": "ungroup",
                    "text": "Ungroup"
                  }
                ]
              }

``

``

              expandedRowRender={record => (
                <div key={`details_${record.id}`}>
                  <Row>
                    <Col span={12}>
                      <Divider orientation="left">
                        Statistics based on historical data
                      </Divider>
                      <Col span={6}>
                        <div className="ant-statistic">
                          <div className="ant-statistic-title">
                            Average number of client reviews
                          </div>
                          <div className="ant-statistic-content">
                            <Progress
                              percent={this.calculateCurrentLoop(record)}
                              size="small"
                              type="dashboard"
                              status={this.getCurrentLoopStatus(record)[0]}
                              strokeColor={this.getCurrentLoopStatus(record)[1]}
                              format={() =>
                                _.round(
                                  this.store.statistics.expectedIterations[
                                    record.payload.Id.substr(0, 9)
                                  ],
                                  1
                                )
                              }
                            />
                          </div>
                        </div>
                      </Col>
                      <Col span={6}>
                        <div className="ant-statistic">
                          <div className="ant-statistic-title">
                            <Popover
                              content={
                                <span>
                                  <div>
                                    Calculated using statistics based on:{" "}
                                  </div>
                                  <div>{record.payload.StatDictionaryName}</div>
                                  <div>
                                    with sample size:{" "}
                                    {record.payload.StatSampleSize}
                                  </div>
                                </span>
                              }
                              title={
                                <span style={{ textAlign: "center" }}>
                                  <div>
                                    Average duration since the document version
                                    was first uploaded
                                  </div>
                                  <div>
                                    until the VISA resulting is uploaded in
                                    DyMaDoc
                                  </div>
                                </span>
                              }
                              trigger="hover"
                              placement="bottom"
                            >
                              Average Process Duration
                            </Popover>
                          </div>
                          <div className="ant-statistic-content">
                            <Progress
                              percent={100}
                              size="small"
                              type="dashboard"
                              strokeColor="#5bceae"
                              format={() =>
                                !!record.payload.ExpectedDuration
                                  ? record.payload.ExpectedDuration.toFixed(1)
                                  : ""
                              }
                            />
                          </div>
                        </div>
                      </Col>
                      {record.payload.RiskStatus > -2 && (
                        <Col span={6}>
                          <div className="ant-statistic">
                            <div className="ant-statistic-title">
                              Predicted Delivery Date
                            </div>
                            <div className="ant-statistic-content">
                              {!(
                                record.payload.PredictedDeliveryDate || ""
                              ).includes("0001") &&
                              !(
                                record.payload.PredictedDeliveryDate || ""
                              ).includes("") ? (
                                moment(
                                  record.payload.PredictedDeliveryDate
                                ).format("LL") || ""
                              ) : (
                                <div>
                                  {(record.payload.ConnectedTasks.length ||
                                    0) === 0 && (
                                    <Popover
                                      placement="top"
                                      content={
                                        (record.payload.ConnectedTasks.length ||
                                          0) === 0 && (
                                          <span>
                                            Document not linked to a task yet or
                                            document needs recalculation!{" "}
                                            <Popover
                                              trigger="click"
                                              title="Assign Tasks"
                                              placement="bottomRight"
                                              content={
                                                <DocumentTaskAssignment
                                                  document={record}
                                                  store={this.store}
                                                />
                                              }
                                            >
                                              <Button type="link">
                                                Assign
                                              </Button>
                                            </Popover>
                                          </span>
                                        )
                                      }
                                    >
                                      ---
                                    </Popover>
                                  )}
                                  {(record.payload.ConnectedTasks.length || 0) >
                                    0 && "---"}
                                </div>
                              )}
                            </div>
                          </div>
                        </Col>
                      )}
                      <Col span={6}>
                        <div className="ant-statistic">
                          <div className="ant-statistic-title">
                            Deadline according to schedule
                          </div>
                          <div className="ant-statistic-content">
                            {!(record.payload.TaskBaselineStart || "").includes(
                              "0001"
                            ) &&
                            !(record.payload.TaskBaselineStart || "").includes(
                              ""
                            )
                              ? moment(record.payload.TaskBaselineStart).format(
                                  "LL"
                                ) || ""
                              : "---"}
                          </div>
                        </div>
                      </Col>
                    </Col>
                    <Col span={12}>
                      <DocumentSteps document={record} />
                    </Col>
                  </Row>
                  <Divider orientation="left">Reference</Divider>
                  <Table
                    size="small"
                    columns={columnsReference}
                    dataSource={[record]}
                    pagination={false}
                    rowKey={(value, index) => `expanded_${value.id}-${index}`}
                  />
                  {!_.isEmpty(record.payload.Comment) && (
                    <div>
                      <Divider orientation="left">Comment</Divider>
                      {record.payload.Comment}
                    </div>
                  )}
                  <Row>
                    <Col span={24}>
                      <ButtonGroup style={{ marginRight: 20, float: "right" }}>
                        {userInfo.hasAccess(
                          "FRONT:Documents:DocumentDetails:Buttons:Edit"
                        ) && (
                          <Button
                            icon="edit"
                            type="primary"
                            onClick={() => {
                              this.store.showEditModal = true;
                              this.store.editModalData = record;
                            }}
                          >
                            Edit {/* SUB | IDO | DCT */}
                          </Button>
                        )}
                        {userInfo.hasAccess(
                          "FRONT:Documents:DocumentDetails:Buttons:DYMADOC"
                        ) && (
                          <Button
                            icon="file-search"
                            type="primary"
                            disabled={_.isEmpty(record.payload.DymadocId)}
                            onClick={() => {
                              window.open(
                                `https://extranet-02.vinci-construction.com/vincic/gp/projet/dymadociter.nsf?Open&Doc=${record.payload.DymadocId}`,
                                "_blank"
                              );
                            }}
                          >
                            DYMADOC
                          </Button>
                        )}
                        {userInfo.hasAccess(
                          "FRONT:Documents:DocumentDetails:Buttons:AssignTask"
                        ) && (
                          <Popover
                            trigger="click"
                            title="Assign Tasks"
                            placement="bottomRight"
                            content={
                              <DocumentTaskAssignment
                                document={record}
                                store={this.store}
                              />
                            }
                          >
                            <Button
                              icon="fork"
                              type="primary"
                              onClick={() =>
                                this.setState({ currentDocument: record })
                              }
                            >
                              Assign Tasks {/* IDO | DCT | PSC */}
                            </Button>
                          </Popover>
                        )}
                        {userInfo.hasAccess(
                          "FRONT:Documents:DocumentDetails:RiskAnalysis"
                        ) && (
                          <Link to={`/assets/${record.rootId}`}>
                            <Button icon="thunderbolt" type="primary">
                              Risk Analysis {/* IDO | DCT */}
                            </Button>
                          </Link>
                        )}
                        {userInfo.hasAccess(
                          "FRONT:Documents:DocumentDetails:Buttons:Delete"
                        ) && (
                          <Popconfirm
                            onConfirm={() => this.store.removeDocument(record)}
                            title="Delete ?"
                            icon={
                              <Icon type="delete" style={{ color: "red" }} />
                            }
                          >
                            <Button type="danger" icon="delete">
                              Delete {/* SUB (Via proposal) | IDO | DCT */}
                            </Button>
                          </Popconfirm>
                        )}
                      </ButtonGroup>
                    </Col>
                  </Row>
                </div>
              )}

              ``
